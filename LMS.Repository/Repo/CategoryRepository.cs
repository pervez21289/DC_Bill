using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using System.Data;
using System.Data.SqlClient;

public class CategoryRepository :BaseRepository, ICategoryRepository
{


    public async Task<IEnumerable<Category>> GetAllAsync(int CompanyID)
    {
        return await   QueryAsync<Category>("GetAllCategories", new {CompanyID=CompanyID}, CommandType.StoredProcedure);
    }

    public async Task<Category?> GetByIdAsync(int id)
    {
        return await   QueryFirstOrDefaultAsync<Category>(
            "SELECT * FROM Categories WHERE CategoryID = @id", new { id }, CommandType.Text);
    }

    public async Task<int> CreateAsync(Category category)
    {
        return await   ExecuteScalarAsync<int>(
            "CreateCategory", new { category.CategoryName, category.CompanyID }, commandType: CommandType.StoredProcedure);
    }

    public async Task<bool> UpdateAsync(Category category)
    {
        return (await   ExecuteAsync("UpdateCategory", new { CategoryID=category.CategoryID, CategoryName=category.CategoryName }, commandType: CommandType.StoredProcedure)) > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return (await   ExecuteAsync("DeleteCategory", new { id }, commandType: CommandType.StoredProcedure)) > 0;
    }
}
