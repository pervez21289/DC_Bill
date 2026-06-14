using LMS.API.Filters;
using LMS.API.Repositories;
using LMS.API.Repositories.Interfaces;
using LMS.API.Services;
using LMS.Core.Interfaces;
using LMS.Repo.Repository;
using LMS.Repository.Repo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddHttpContextAccessor();

// Register background logging service as singleton
builder.Services.AddSingleton<IErrorLogger, ErrorLogger>();
builder.Services.AddSingleton<IBackgroundLogService, BackgroundLogService>();
builder.Services.AddHostedService<BackgroundLogService>(provider =>
    (BackgroundLogService)provider.GetRequiredService<IBackgroundLogService>());


// Add services to the container.
builder.Services.AddScoped<IBillingSettingsRepository, BillingSettingsRepository>();
builder.Services.AddScoped<IItemMasterRepository, ItemMasterRepository>();
builder.Services.AddScoped<IPartyRepository, PartyRepository>();
builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddSingleton<BaseRepository>();
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IReportRepository, ReportRepository>();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<CompanyResolver>();

// Add controllers with global filter
builder.Services.AddControllers(options =>
{
    // Apply logging filter to ALL controllers automatically
    options.Filters.Add<AutoLoggingFilter>();
});

// Add CORS for React app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins(
                "http://localhost:3000",
                "https://localhost:3000",
                "http://localhost:5173",
                "https://localhost:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// =============================================
// JWT Authentication Configuration
// =============================================

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["Secret"] ?? builder.Configuration["JwtSettings:Secret"];

if (!string.IsNullOrEmpty(secretKey))
{
    var key = Encoding.ASCII.GetBytes(secretKey);

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings["Issuer"] ?? builder.Configuration["JwtSettings:Issuer"],
            ValidateAudience = true,
            ValidAudience = jwtSettings["Audience"] ?? builder.Configuration["JwtSettings:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });
}

builder.Services.AddAuthorization();

// =============================================
// Swagger Configuration for .NET 10
// =============================================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "LMS API",
        Version = "v1",
        Description = "Learning Management System API"
    });

    // Add JWT Authentication support to Swagger
    // Using "bearer" with lowercase 'b' as the scheme name is required for .NET 10 [citation:8]
    c.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme, // "Bearer"
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' followed by your token. Example: 'Bearer abc123xyz'"
    });

    //// Updated syntax for Swashbuckle v10 - uses OpenApiSecuritySchemeReference [citation:4][citation:8]
    //c.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    //{
    //    [new OpenApiSecuritySchemeReference("bearer", document)] = Array.Empty<string>()
    //});
});

var app = builder.Build();

// Validate and set connection string
var connectionString = app.Configuration.GetConnectionString("Value");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'Value' not found in configuration");
}
BaseRepository.ConnectionString = connectionString;

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "LMS API V1");
        c.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();

// IMPORTANT: CORS must come before Authentication and Authorization
app.UseCors("AllowReactApp");

// Add authentication if JWT is configured
if (!string.IsNullOrEmpty(secretKey))
{
    app.UseAuthentication();
}
app.UseAuthorization();

app.MapControllers();

// This should be last - catches all non-API routes for React
app.MapFallbackToFile("index.html");

app.Run();