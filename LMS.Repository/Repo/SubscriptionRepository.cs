using Amazon.Runtime.Internal;
using Azure.Core;
using Dapper;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using Microsoft.Extensions.Configuration;
using Org.BouncyCastle.Asn1.Ocsp;

using System;
using System.Collections.Generic;
using System.Data;
namespace LMS.Repository.Repo
{
    public class SubscriptionRepository :BaseRepository, ISubscriptionRepository
    {
        private readonly IConfiguration _configuration;
        private readonly RazorpayOptions _razorpay;
        private readonly IBackgroundJobQueue _jobQueue;
        public SubscriptionRepository(IConfiguration configuration,  IBackgroundJobQueue jobQueue)
        {
            _configuration = configuration;
           
            _jobQueue = jobQueue;

        }

        public async Task<bool> InsertSubscriptionAsync(SubscriptionPlan subscription)
        {

            var parameters = new
            {
                CustomerId = subscription.CustomerId,
                PlanName = subscription.PlanName,
                PlanType = subscription.PlanType,
                AmountPaid = subscription.AmountPaid,
                Currency = subscription.Currency,
                RazorpayOrderId = subscription.RazorpayOrderId,
                RazorpayPaymentId = subscription.RazorpayPaymentId,
                PaymentStatus = subscription.PaymentStatus,
                PlanStartDate = subscription.PlanStartDate,
                PlanEndDate = subscription.PlanEndDate
            };

            var result = await ExecuteAsync("InsertSubscription", parameters, commandType: CommandType.StoredProcedure);

            await _jobQueue.EnqueueAsync(new BackgroundJob
            {
                JobType = BackgroundJobType.SendInvoiceEmail,
                Payload = (subscription.CustomerId)
            });

            return result > 0;
        }

        public async Task<SubscriptionPlan> GetCurrentActivePlanAsync(int customerId)
        {
            var parameters = new { CustomerId = customerId };
            return await QueryFirstOrDefaultAsync<SubscriptionPlan>(
                "GetCurrentActivePlan",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }

        
    }
}
