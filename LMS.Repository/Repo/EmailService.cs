using LMS.API.Repositories.Interfaces;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace LMS.Repository.Repo
{
    public class EmailService : IEmailService
    {
       
        public readonly AppSettings _appSettings;
   

        public EmailService( AppSettings appSettings)
        {
            _appSettings = appSettings;
        }



        public async Task SendVerificationEmailAsync(string toEmail, string userName, string token)
        {
            var templatePath = Path.Combine(AppContext.BaseDirectory, "Files", "VerifyEmail.html");
            var html = await File.ReadAllTextAsync(templatePath);

            var verificationLink =
                $"{_appSettings.RedirectUrl}/verify-email?email={Uri.EscapeDataString(toEmail)}&token={Uri.EscapeDataString(token)}";

            html = html
                .Replace("{{AppName}}", "NexBillPos")
                .Replace("{{UserName}}", WebUtility.HtmlEncode(userName))
                .Replace("{{Email}}", WebUtility.HtmlEncode(toEmail))
                .Replace("{{VerificationLink}}", verificationLink)
                .Replace("{{ExpiryHours}}", "24")
                .Replace("{{Year}}", DateTime.UtcNow.Year.ToString());

            await SendAsync(toEmail, "Verify your email - NexBillPos", html);
        }

        public async Task SendAsync(string to, string subject, string htmlBody)
        {
            using var msg = new MailMessage
            {
                From = new MailAddress(_appSettings.Email, "NexBillPos"),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };
            msg.To.Add(new MailAddress(to));

            using var client = new SmtpClient("smtp.gmail.com", 587)
            {
                EnableSsl = true,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(_appSettings.Email, _appSettings.Secret.Replace(" ", "")),
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Timeout = 30000
            };

            await client.SendMailAsync(msg);
        }


    }
}
