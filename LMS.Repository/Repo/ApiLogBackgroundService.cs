using LMS.Core.Entities;
using LMS.Core.Interfaces;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Data;
using System.Threading;
using System.Threading.Tasks;

namespace LMS.Repo.Repository
{
    public class ApiLogBackgroundService : BackgroundService
    {
        private readonly IBackgroundJobQueue _jobQueue;
        private readonly BaseRepository _repository;
        private readonly ILogger<ApiLogBackgroundService> _logger;
        private readonly IEmailSender _emailSender;

        public ApiLogBackgroundService(
            IBackgroundJobQueue jobQueue,
            BaseRepository repository,
            ILogger<ApiLogBackgroundService> logger,
            IEmailSender emailSender)
        {
            _jobQueue = jobQueue;
            _repository = repository;
            _logger = logger;
            _emailSender = emailSender;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await foreach (var job in ReadJobsAsync(stoppingToken))
            {
                try
                {
                    switch (job.JobType)
                    {
                        case BackgroundJobType.ApiLog:
                            var logEntry = (ApiLogEntry)job.Payload;
                            const string sql = @"
                                INSERT INTO ApiLogs (Timestamp, Path, Method, IpAddress, StatusCode, DurationMs, UserId)
                                VALUES (@Timestamp, @Path, @Method, @IpAddress, @StatusCode, @DurationMs, @UserId)";
                            await _repository.ExecuteAsync(sql, logEntry, CommandType.Text);
                            break;

                        case BackgroundJobType.SendEmail:
                            var (email,name,otp) = ((string Email,string Name, string Otp))job.Payload;
                            await _emailSender.SentOTPSync(email,name, otp);
                            break;
                        case BackgroundJobType.SentOTPMobile:
                            var (mobile, mobileotp) = ((string mobile, string mobileotp))job.Payload;
                            await _emailSender.SentOTPMobileSync(mobile, mobileotp);
                            break;
                        case BackgroundJobType.SendResetPasswordEmail:
                            var (resetEmail, resetToken) = ((string Email, string ResetToken))job.Payload;
                            await _emailSender.SendResetPasswordEmail(resetEmail, resetToken);
                            break;
                        case BackgroundJobType.SendInvoiceEmail:
                            var customerId = (int)job.Payload;
                            await _emailSender.SentInvoiceDetails(customerId);
                            break;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error processing {job.JobType} job");
                }
            }
        }

        private async IAsyncEnumerable<BackgroundJob> ReadJobsAsync([System.Runtime.CompilerServices.EnumeratorCancellation] CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                yield return await _jobQueue.DequeueAsync(cancellationToken);
            }
        }
    }
}
