using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;
using LMS.Core.Entities;
using Microsoft.AspNetCore.Http;

namespace LMS.Core.Interfaces
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string toEmail, string otp);
        Task<Result> SentOTPSync(string email, string Name, string OTP);
        Task SentOTPMobileSync(string mobile, string OTP);
        Task<Result> SendResetPasswordEmail(string email, string resetToken);
        Task<Result> SentInvoiceDetails(int CustomerId);
    }

}
