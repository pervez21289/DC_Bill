
using LMS.Core.Entities;
using Razorpay.Api;

namespace LMS.Core.Interfaces
{
    public interface ISubscriptionRepository
    {
        Task<bool> InsertSubscriptionAsync(SubscriptionPlan subscription);
        Task<SubscriptionPlan> GetCurrentActivePlanAsync(int customerId);
        
    }
}
