using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LMS.Core.Entities;

namespace LMS.Core.Interfaces
{
    public interface IBooking
    {
        public Task<BookingModel> SaveBooking(Booking booking);
        public Task<IEnumerable<BookingModel>> GetBookings(int? UserId,long? BookingId);
        public Task<Result> CallBooking(CallDetails call);

        public Task<Result> SentEmail(BookingModel bookingModel);
    }
}
