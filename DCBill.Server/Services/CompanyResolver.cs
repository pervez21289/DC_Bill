// Middleware/CompanyResolver.cs
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

public class CompanyResolver
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CompanyResolver(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int CurrentCompanyId
    {
        get
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user == null) return 0;

            var companyIdClaim = user.Claims.FirstOrDefault(c => c.Type == "CompanyId" || c.Type == "companyId");
            if (companyIdClaim != null && int.TryParse(companyIdClaim.Value, out int companyId))
            {
                return companyId;
            }

            return 0;
        }
    }

    public int CurrentUserId
    {
        get
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user == null) return 0;

            var userIdClaim = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier || c.Type == "UserId");
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }

            return 0;
        }
    }
}