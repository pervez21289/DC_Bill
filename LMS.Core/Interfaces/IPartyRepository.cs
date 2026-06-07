using LMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Interfaces
{
    public interface IItemMasterRepository
    {
        Task<IEnumerable<ItemMaster>> GetAsync();
        Task<ItemMaster> GetByIdAsync(int id);
        Task<int> CreateAsync(ItemMaster model);
        Task<int> UpdateAsync(ItemMaster model);
        Task<int> DeleteAsync(int id);
        Task<IEnumerable<ItemMaster>> SearchAsync(string keyword);
    }

}
