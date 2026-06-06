using LMS.Core.Entities;
using LMS.Core.Interfaces;
using System.Threading.Channels;

namespace LMS.Repo.Repository
{
    public class BackgroundJobQueue : IBackgroundJobQueue
    {
        private readonly Channel<BackgroundJob> _queue;

        public BackgroundJobQueue()
        {
            // Bounded queue so memory usage doesn’t explode
            _queue = Channel.CreateBounded<BackgroundJob>(new BoundedChannelOptions(100)
            {
                FullMode = BoundedChannelFullMode.Wait
            });
        }

        public async ValueTask EnqueueAsync(BackgroundJob job)
        {
            if (job == null) throw new ArgumentNullException(nameof(job));
            await _queue.Writer.WriteAsync(job);
        }

        public async ValueTask<BackgroundJob> DequeueAsync(CancellationToken cancellationToken)
        {
            return await _queue.Reader.ReadAsync(cancellationToken);
        }
    }
}
