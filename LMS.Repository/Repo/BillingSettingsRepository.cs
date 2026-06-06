using Dapper;
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Threading.Tasks;

namespace LMS.Repository.Repo
{
    public class BillingSettingsRepository : BaseRepository, IBillingSettingsRepository
    {

        public async Task<BillingSettings?> GetAsync()
        {
            var sql = "USP_GetBillingSettings";
            return await QueryFirstOrDefaultAsync<BillingSettings>(sql, null, CommandType.StoredProcedure);
        }

        public async Task<int> CreateAsync(BillingSettings model)
        {
            var parameters = new
            {
                model.CompanyName,
                model.GSTIN,
                model.MobileNumber,
                model.Address,
                model.City,
                model.PinCode,
                model.State,
                model.Country
            };

            var sql = "USP_CreateBillingSettings";
            return await ExecuteScalarAsync<int>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<int> UpdateAsync(BillingSettings model)
        {
            var parameters = new
            {
                model.Id,
                model.CompanyName,
                model.GSTIN,
                model.MobileNumber,
                model.Address,
                model.City,
                model.PinCode,
                model.State,
                model.Country
            };

            var sql = "USP_UpdateBillingSettings";
            return await ExecuteAsync(sql, parameters, CommandType.StoredProcedure);
        }
    }
}