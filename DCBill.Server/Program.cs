using LMS.API.Repositories;
using LMS.API.Repositories.Interfaces;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using LMS.Repository.Repo;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<IBillingSettingsRepository, BillingSettingsRepository>();
builder.Services.AddScoped<IItemMasterRepository, ItemMasterRepository>();
builder.Services.AddScoped<IPartyRepository, PartyRepository>();
builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();
builder.Services.AddSingleton<BaseRepository>();
builder.Services.AddControllers();

// Add CORS for React app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins(
                "http://localhost:3000",      // React dev
                "https://localhost:3000",
                "http://localhost:5173",      // Vite dev (if using)
                "https://yourdomain.com"      // Production URL
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Add API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
BaseRepository.ConnectionString = app.Configuration.GetConnectionString("Value");

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.MapStaticAssets();

// IMPORTANT: CORS must come before Authorization
app.UseCors("AllowReactApp");
app.UseAuthorization();

app.MapControllers();

// This should be last - catches all non-API routes for React
app.MapFallbackToFile("/index.html");

app.Run();