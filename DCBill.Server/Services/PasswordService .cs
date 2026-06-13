// LMS.API/Services/PasswordService.cs
using BCrypt.Net;
using LMS.Core.Interfaces;

namespace LMS.API.Services
{
    public class PasswordService : IPasswordService
    {
        private readonly int _workFactor;

        public PasswordService(IConfiguration configuration)
        {
            // Get work factor from configuration (default to 11)
            _workFactor = configuration.GetValue<int>("Security:BcryptWorkFactor", 11);
        }

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, _workFactor);
        }

        public bool VerifyPassword(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }
}