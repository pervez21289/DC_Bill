using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

public class BillingSettingsRepository : IBillingSettingsRepository
{
    private readonly IConfiguration _configuration;

    public BillingSettingsRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private IDbConnection Connection =>
        new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<BillingSettings?> GetAsync()
    {
        var sql = @"SELECT TOP 1 *
                    FROM BillingSettings
                    ORDER BY Id";

        using var db = Connection;

        return await db.QueryFirstOrDefaultAsync<BillingSettings>(sql);
    }

    public async Task<int> CreateAsync(BillingSettings model)
    {
        var sql = @"
        INSERT INTO BillingSettings
        (
            CompanyName,
            GSTIN,
            MobileNumber,
            Address,
            City,
            PinCode,
            State,
            Country
        )
        VALUES
        (
            @CompanyName,
            @GSTIN,
            @MobileNumber,
            @Address,
            @City,
            @PinCode,
            @State,
            @Country
        );

        SELECT CAST(SCOPE_IDENTITY() AS INT);";

        using var db = Connection;

        return await db.ExecuteScalarAsync<int>(sql, model);
    }

    public async Task<int> UpdateAsync(BillingSettings model)
    {
        var sql = @"
        UPDATE BillingSettings
        SET
            CompanyName = @CompanyName,
            GSTIN = @GSTIN,
            MobileNumber = @MobileNumber,
            Address = @Address,
            City = @City,
            PinCode = @PinCode,
            State = @State,
            Country = @Country,
            UpdatedDate = GETDATE()
        WHERE Id = @Id";

        using var db = Connection;

        return await db.ExecuteAsync(sql, model);
    }
}