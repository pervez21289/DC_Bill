
using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LMS.API.Repositories
{
    public class ItemMasterRepository : BaseRepository, IItemMasterRepository
    {

        public async Task<IEnumerable<ItemMaster>> GetAsync()
        {
            var sql = "USP_GetItemMaster";
            return await QueryAsync<ItemMaster>(sql, null, CommandType.StoredProcedure);
        }

        public async Task<ItemMaster> GetByIdAsync(int id)
        {
            var parameters = new { Id = id };
            var sql = "USP_GetItemMasterById";
            return await QueryFirstOrDefaultAsync<ItemMaster>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<int> CreateAsync(ItemMaster model)
        {
            var parameters = new
            {
                model.ItemName,
                model.HsnCode,
                model.Rate,
                model.GST
            };

            var sql = "USP_CreateItemMaster";
            return await ExecuteScalarAsync<int>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<int> UpdateAsync(ItemMaster model)
        {
            var parameters = new
            {
                model.Id,
                model.ItemName,
                model.HsnCode,
                model.Rate,
                model.GST
            };

            var sql = "USP_UpdateItemMaster";
            return await ExecuteScalarAsync<int>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<int> DeleteAsync(int id)
        {
            var parameters = new { Id = id };
            var sql = "USP_DeleteItemMaster";
            return await ExecuteScalarAsync<int>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ItemMaster>> SearchAsync(string keyword)
        {
            var parameters = new { Keyword = keyword };
            var sql = "USP_SearchItemMaster";
            return await QueryAsync<ItemMaster>(sql, parameters, CommandType.StoredProcedure);
        }
    }
}