using Dapper;
using LMS.Core.Entities;
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
    public class BasicSettingRepository :BaseRepository, IBasicSettingRepository
    {
       
        public async Task<IEnumerable<BasicSetting>> GetAllAsync()
        {

            return await QueryAsync<BasicSetting>(
                "GetAllBasicSettings",
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<BasicSetting?> GetByIdAsync(int id, int CompanyID)
        {
            
            return await QueryFirstOrDefaultAsync<BasicSetting>(
                "GetBasicSettingById",
                new { Id = id,CompanyID=CompanyID },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<int> InsertAsync(BasicSetting setting)
        {
           
            return await ExecuteScalarAsync<int>(
                "InsertBasicSetting",
                new
                {
                    setting.StoreName,
                    setting.Address,
                    setting.ContactEmail,
                    setting.GSTIN,
                    setting.GST,
                    setting.CompanyID
                },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<int> UpdateAsync(BasicSetting setting)
        {
            
            return await ExecuteAsync(
                "UpdateBasicSetting",
                new
                {
                    setting.Id,
                    setting.StoreName,
                    setting.Address,
                    setting.ContactEmail,
                    setting.GST,
                    setting.GSTIN
                },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<int> DeleteAsync(int id)
        {
           
            return await ExecuteAsync(
                "DeleteBasicSetting",
                new { Id = id },
                commandType: CommandType.StoredProcedure
            );
        }
    }


}
