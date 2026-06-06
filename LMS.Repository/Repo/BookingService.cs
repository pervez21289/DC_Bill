using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using TrustCab.Core.Entities;
using TrustCab.Core.Interfaces;

namespace TrustCab.DAL.Repository
{
    public class BookingService: BaseRepository,IBooking
    {
        public async Task<BookingModel> SaveBooking(Booking booking)
        {
            try
            {
                return await QueryFirstOrDefaultAsync<BookingModel>("SP_SaveBooking", booking);
            }
            catch(Exception e)
            {
                throw e;
            }

        }

      
        public async Task<IEnumerable<BookingModel>> GetBookings(int? UserId,long? BookingId)
        {
            return await QueryAsync<BookingModel>("SP_GetBookings",new { UserId=UserId});
        }
        public async Task<Result> CallBooking(CallDetails call)
        {
            try
            {
                return await QueryFirstOrDefaultAsync<Result>("SP_SaveCall", new { CallData = call.CallData });
            }
            catch(Exception e)
            {
                throw e;
            }
        }

        public async Task<Result> SentEmail(BookingModel bookingModel)
        {
            try
            {
                MailMessage message = new MailMessage();
                message.From = new MailAddress("aliusman9760@gmail.com");
                message.To.Add("aliusman9760@gmail.com");
                message.Subject = "New Booking #" + bookingModel.BookingId;
                message.IsBodyHtml = true;
                message.Body = bookingModel.Html;

                SmtpClient client = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential("aliusman9760@gmail.com", "obqeowhuunshhxex"),
                    EnableSsl = true
                };


                client.SendAsync(message, null);
               

                return new Result() { IsSuccess = true, Message = "Email sent successfully" };
            }
            catch(Exception e)
            {
                throw e;
            }
        }


    }
}
