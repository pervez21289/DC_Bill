using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
    public enum BackgroundJobType
    {
        ApiLog,
        SendEmail,
        SendResetPasswordEmail,
        SendInvoiceEmail,
        SentOTPMobile
    }
    public class BackgroundJob
    {
        public BackgroundJobType JobType { get; set; }
        public object Payload { get; set; } = default!;
    }
}
