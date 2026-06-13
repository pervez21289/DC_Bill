using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;
using LMS.Core.Entities;
using LMS.Core.Models;
using Microsoft.AspNetCore.Http;

namespace LMS.Core.Interfaces
{
    public interface IUser
    {
        Task<CreateUserResult> RegisterCompanyWithAdminAsync(RegisterRequest request);
        Task<LoginResponse?> LoginAsync(string email, string password);
        Task<int> CreateUserAsync(UpdateUserRequest user);
        Task DeleteUserAsync(int userId);
        Task<IEnumerable<UpdateUserRequest>> GetUsersAsync(int CompanyID);
        Task<IEnumerable<ApiLog>> GetApiLogsAsync(int CompanyId,string search, DateTime? startDate, DateTime? endDate);
        Task<LoginResponse?> ValidateOTP(UpdateUserRequest user);
        Task<bool> ForgotPasswordAsync(string email);
        Task<bool> ResetPasswordAsync(string token, string newPassword);
    }
}
