
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;
using LMS.Core.Entities;
using Microsoft.AspNetCore.Http;

namespace LMS.Core.Interfaces
{
    public interface IBackgroundJobQueue
    {
        ValueTask EnqueueAsync(BackgroundJob job);
        ValueTask<BackgroundJob> DequeueAsync(CancellationToken cancellationToken);
    }

}
