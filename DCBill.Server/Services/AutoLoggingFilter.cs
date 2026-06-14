// Filters/AutoLoggingFilter.cs
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Diagnostics;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace LMS.API.Filters
{
    public class AutoLoggingFilter : IAsyncActionFilter
    {
        private readonly IBackgroundLogService _logService;
        private readonly ILogger<AutoLoggingFilter> _logger;

        public AutoLoggingFilter(IBackgroundLogService logService, ILogger<AutoLoggingFilter> logger)
        {
            _logService = logService;
            _logger = logger;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var stopwatch = Stopwatch.StartNew();
            var httpContext = context.HttpContext;
            var request = httpContext.Request;

            // Capture request details BEFORE action executes
            var requestInfo = new RequestInfo
            {
                UserId = GetUserId(httpContext),
                CompanyId = GetCompanyId(httpContext),
                IpAddress = GetIpAddress(httpContext),
                UserAgent = request.Headers["User-Agent"].ToString(),
                RequestUrl = $"{request.Path}{request.QueryString}",
                RequestMethod = request.Method,
                Action = $"{context.Controller.ToString().Split('.').Last().Replace("Controller", "")}.{context.ActionDescriptor.RouteValues["action"]}",
                Entity = context.Controller.ToString().Split('.').Last().Replace("Controller", ""),
                Parameters = GetParameters(context.ActionArguments),
                CreatedAt = DateTime.UtcNow
            };

            // Extract EntityId from parameters if present
            requestInfo.EntityId = ExtractEntityId(context.ActionArguments);

            // Read request body if it's a JSON request
            if (IsJsonRequest(request))
            {
                requestInfo.RequestBody = await ReadRequestBody(request);
            }

            // Execute the action
            var resultContext = await next();
            stopwatch.Stop();

            // Capture response details
            requestInfo.ResponseStatus = resultContext.HttpContext.Response.StatusCode;
            requestInfo.ExecutionTimeMs = (int)stopwatch.ElapsedMilliseconds;

            // Capture response body for successful ObjectResults
            if (resultContext.Result is ObjectResult objectResult && objectResult.Value != null)
            {
                try
                {
                    requestInfo.NewValues = JsonSerializer.Serialize(objectResult.Value, new JsonSerializerOptions
                    {
                        MaxDepth = 10,
                        ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles
                    });

                    // Truncate if too large
                    if (requestInfo.NewValues?.Length > 10000)
                        requestInfo.NewValues = requestInfo.NewValues.Substring(0, 10000) + "...[truncated]";
                }
                catch (Exception ex)
                {
                    requestInfo.NewValues = $"{{ \"error\": \"Unable to serialize response: {ex.Message}\" }}";
                }
            }

            // Capture errors
            if (resultContext.Exception != null)
            {
                requestInfo.Details = $"Error: {resultContext.Exception.Message}";
                _logger.LogError(resultContext.Exception, "Error in action {Action}", requestInfo.Action);
            }
            else
            {
                requestInfo.Details = $"Executed in {requestInfo.ExecutionTimeMs}ms";
            }

            // Queue log asynchronously (non-blocking)
            _logService.Enqueue(requestInfo);
        }

        private int? GetUserId(HttpContext context)
        {
            var userIdClaim = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                userIdClaim = context.User?.FindFirst("UserId")?.Value;

            return !string.IsNullOrEmpty(userIdClaim) ? int.Parse(userIdClaim) : (int?)null;
        }

        private int? GetCompanyId(HttpContext context)
        {
            var companyIdClaim = context.User?.FindFirst("CompanyId")?.Value;
            return !string.IsNullOrEmpty(companyIdClaim) ? int.Parse(companyIdClaim) : (int?)null;
        }

        private string GetIpAddress(HttpContext context)
        {
            var ip = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (string.IsNullOrEmpty(ip))
                ip = context.Connection.RemoteIpAddress?.ToString();
            return ip ?? "Unknown";
        }

        private bool IsJsonRequest(HttpRequest request)
        {
            return request.ContentType != null &&
                   request.ContentType.Contains("application/json");
        }

        private async Task<string> ReadRequestBody(HttpRequest request)
        {
            request.EnableBuffering();
            using var reader = new StreamReader(request.Body, Encoding.UTF8, leaveOpen: true);
            var body = await reader.ReadToEndAsync();
            request.Body.Position = 0;

            // Limit body size to 10KB to avoid huge logs
            if (body.Length > 10240)
                return "Request body too large (>10KB)";

            return body;
        }

        private string GetParameters(IDictionary<string, object> arguments)
        {
            if (arguments == null || !arguments.Any())
                return null;

            try
            {
                var cleanParams = new Dictionary<string, object>();
                foreach (var arg in arguments)
                {
                    var key = arg.Key.ToLower();
                    if (key.Contains("password") || key.Contains("token") ||
                        key.Contains("secret") || key.Contains("creditcard"))
                    {
                        cleanParams[arg.Key] = "***REDACTED***";
                    }
                    else
                    {
                        cleanParams[arg.Key] = arg.Value;
                    }
                }
                return JsonSerializer.Serialize(cleanParams);
            }
            catch
            {
                return "Unable to serialize parameters";
            }
        }

        private string ExtractEntityId(IDictionary<string, object> arguments)
        {
            if (arguments == null) return null;

            // Common parameter names that contain IDs
            var possibleIdParams = new[] { "id", "Id", "ID", "userId", "invoiceId", "productId", "customerId" };

            foreach (var paramName in possibleIdParams)
            {
                if (arguments.TryGetValue(paramName, out var value) && value != null)
                {
                    return value.ToString();
                }
            }

            return null;
        }
    }
}