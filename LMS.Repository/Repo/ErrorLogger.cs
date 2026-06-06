using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Repository.Repo
{
    public class ErrorLogger :BaseRepository, IErrorLogger
    {

        public void Log(Exception ex)
        {
            try
            {
                Execute("LogError",
                    new
                    {
                        Message = ex.Message,
                        StackTrace = ex.StackTrace
                    },CommandType.StoredProcedure);
            }
            catch
            {
                // Fallback if logging itself fails (optional: write to file or Windows Event Log)
            }
        }
    }

}
