using LMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Interfaces
{
    public interface IBasicSettingRepository
    {
        Task<IEnumerable<BasicSetting>> GetAllAsync();
        Task<BasicSetting?> GetByIdAsync(int id,int CompanyID);
        Task<int> InsertAsync(BasicSetting setting);
        Task<int> UpdateAsync(BasicSetting setting);
        Task<int> DeleteAsync(int id);
    }

}
