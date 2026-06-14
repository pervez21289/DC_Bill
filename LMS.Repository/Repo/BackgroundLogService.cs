// Services/BackgroundLogService.cs
using Dapper;

using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;
using System.Data;

namespace LMS.API.Services
{
    public class BackgroundLogService :  BackgroundService, IBackgroundLogService
    {
        private readonly ConcurrentQueue<RequestInfo> _queue = new();
        private readonly ILogger<BackgroundLogService> _logger;
        private readonly IErrorLogger _errorLogger;


        private readonly int _batchSize = 50;
        private readonly int _batchDelayMs = 3000;

        public BackgroundLogService(
            IConfiguration configuration,
            ILogger<BackgroundLogService> logger,IErrorLogger errorLogger)
        {
           
            _logger = logger;
            _batchSize = 5;
            _batchDelayMs = 500;
            _errorLogger = errorLogger;

        }

        public void Enqueue(RequestInfo requestInfo)
        {
            if (requestInfo == null) return;
            _queue.Enqueue(requestInfo);

            // Log warning if queue is getting too large
            if (_queue.Count > 1000)
            {
                _logger.LogWarning($"Log queue is large: {_queue.Count} items pending");
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Background Log Service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var batch = new List<RequestInfo>();

                    // Collect batch
                    while (batch.Count < _batchSize && _queue.TryDequeue(out var log))
                    {
                        batch.Add(log);
                    }

                    if (batch.Any())
                    {
                        await BulkInsertLogsAsync(batch);
                        _logger.LogDebug($"Saved {batch.Count} logs to database");
                    }

                    await Task.Delay(_batchDelayMs, stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing log batch");
                }
            }

            // Process remaining logs before shutdown
            await ProcessRemainingLogsAsync();
        }

        private async Task BulkInsertLogsAsync(List<RequestInfo> logs)
        {
            var dataTable = new DataTable();
            dataTable.Columns.Add("UserId", typeof(int));
            dataTable.Columns.Add("CompanyId", typeof(int));
            dataTable.Columns.Add("Action", typeof(string));
            dataTable.Columns.Add("Entity", typeof(string));
            dataTable.Columns.Add("EntityId", typeof(string));
            dataTable.Columns.Add("Details", typeof(string));
            dataTable.Columns.Add("OldValues", typeof(string));
            dataTable.Columns.Add("NewValues", typeof(string));
            dataTable.Columns.Add("RequestBody", typeof(string));
            dataTable.Columns.Add("Parameters", typeof(string));
            dataTable.Columns.Add("IpAddress", typeof(string));
            dataTable.Columns.Add("UserAgent", typeof(string));
            dataTable.Columns.Add("RequestUrl", typeof(string));
            dataTable.Columns.Add("RequestMethod", typeof(string));
            dataTable.Columns.Add("ResponseStatus", typeof(int));
            dataTable.Columns.Add("ExecutionTimeMs", typeof(int));
            dataTable.Columns.Add("CreatedAt", typeof(DateTime));

            foreach (var log in logs)
            {
                dataTable.Rows.Add(
                    log.UserId,
                    log.CompanyId,
                    log.Action ?? "Unknown",
                    log.Entity,
                    log.EntityId,
                    log.Details,
                    log.OldValues,
                    log.NewValues,
                    log.RequestBody,
                    log.Parameters,
                    log.IpAddress,
                    log.UserAgent,
                    log.RequestUrl,
                    log.RequestMethod,
                    log.ResponseStatus,
                    log.ExecutionTimeMs,
                    log.CreatedAt
                );
            }

            await _errorLogger.BulkInsertLogsAsync(dataTable);
        }

        private async Task ProcessRemainingLogsAsync()
        {
            var remainingLogs = new List<RequestInfo>();
            while (_queue.TryDequeue(out var log))
            {
                remainingLogs.Add(log);
            }

            if (remainingLogs.Any())
            {
                await BulkInsertLogsAsync(remainingLogs);
                _logger.LogInformation($"Processed {remainingLogs.Count} remaining logs before shutdown");
            }
        }
    }
}