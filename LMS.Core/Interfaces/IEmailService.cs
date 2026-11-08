using System;
using System.Collections.Generic;
using System.Text;

namespace LMS.Core.Interfaces
{
    public interface IEmailService
    {
        Task SendAsync(string to, string subject, string htmlBody);
        Task SendVerificationEmailAsync(string email, string name, string token);
    }
}
