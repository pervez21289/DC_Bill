using LMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Interfaces
{
    public interface IPartyRepository
    {
        Task<IEnumerable<Party>> GetAsync();
        Task<Party> GetByIdAsync(int id);
        Task<Party> GetByGSTINAsync(string gstin);
        Task<int> CreateAsync(Party model);
        Task<int> UpdateAsync(Party model);
        Task<int> DeleteAsync(int id);
        Task<IEnumerable<Party>> SearchAsync(string keyword);
    }

}
