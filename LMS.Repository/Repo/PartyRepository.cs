
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LMS.API.Repositories
{
    public class PartyRepository : BaseRepository, IPartyRepository
    {
     

        public async Task<IEnumerable<Party>> GetAsync()
        {
            var sql = "USP_GetParties";
            return await QueryAsync<Party>(sql, null, CommandType.StoredProcedure);
        }

        public async Task<Party> GetByIdAsync(int id)
        {
            var parameters = new { Id = id };
            var sql = "USP_GetPartyById";
            return await QueryFirstOrDefaultAsync<Party>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<Party> GetByGSTINAsync(string gstin)
        {
            var parameters = new { GSTIN = gstin };
            var sql = "USP_GetPartyByGSTIN";
            return await QueryFirstOrDefaultAsync<Party>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<int> CreateAsync(Party model)
        {
            var parameters = new
            {
                model.PartyName,
                model.Address,
                model.City,
                model.State,
                model.PinCode,
                model.GSTIN,
                model.Mobile,
                model.Email
            };

            var sql = "USP_CreateParty";
            return await ExecuteScalarAsync<int>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<int> UpdateAsync(Party model)
        {
            var parameters = new
            {
                model.Id,
                model.PartyName,
                model.Address,
                model.City,
                model.State,
                model.PinCode,
                model.GSTIN,
                model.Mobile,
                model.Email
            };

            var sql = "USP_UpdateParty";
            return await ExecuteAsync(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<int> DeleteAsync(int id)
        {
            var parameters = new { Id = id };
            var sql = "USP_DeleteParty";
            return await ExecuteAsync(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<Party>> SearchAsync(string keyword)
        {
            var parameters = new { Keyword = keyword };
            var sql = "USP_SearchParty";
            return await QueryAsync<Party>(sql, parameters, CommandType.StoredProcedure);
        }
    }
}