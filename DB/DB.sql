USE [DCBill_Dev]
GO
/****** Object:  UserDefinedTableType [dbo].[ActivityLogType]    Script Date: 10-07-2026 11.17.58 PM ******/
CREATE TYPE [dbo].[ActivityLogType] AS TABLE(
	[UserId] [int] NULL,
	[CompanyId] [int] NULL,
	[Action] [nvarchar](200) NOT NULL,
	[Entity] [nvarchar](100) NULL,
	[EntityId] [nvarchar](100) NULL,
	[Details] [nvarchar](max) NULL,
	[OldValues] [nvarchar](max) NULL,
	[NewValues] [nvarchar](max) NULL,
	[RequestBody] [nvarchar](max) NULL,
	[Parameters] [nvarchar](max) NULL,
	[IpAddress] [nvarchar](50) NULL,
	[UserAgent] [nvarchar](500) NULL,
	[RequestUrl] [nvarchar](500) NULL,
	[RequestMethod] [nvarchar](10) NULL,
	[ResponseStatus] [int] NULL,
	[ExecutionTimeMs] [int] NULL,
	[CreatedAt] [datetime2](7) NOT NULL
)
GO
/****** Object:  Table [dbo].[ActivityLogs]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ActivityLogs](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NULL,
	[CompanyId] [int] NULL,
	[Action] [varchar](200) NOT NULL,
	[Entity] [varchar](100) NULL,
	[EntityId] [varchar](100) NULL,
	[OldValues] [varchar](max) NULL,
	[NewValues] [varchar](max) NULL,
	[RequestBody] [varchar](max) NULL,
	[Parameters] [varchar](max) NULL,
	[IpAddress] [varchar](50) NULL,
	[UserAgent] [varchar](500) NULL,
	[RequestUrl] [varchar](500) NULL,
	[RequestMethod] [varchar](10) NULL,
	[ResponseStatus] [int] NULL,
	[ExecutionTimeMs] [int] NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BillingSettings]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BillingSettings](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NULL,
	[CompanyName] [nvarchar](200) NOT NULL,
	[GSTIN] [varchar](50) NULL,
	[MobileNumber] [varchar](50) NULL,
	[Address] [varchar](20) NULL,
	[City] [varchar](200) NULL,
	[PinCode] [varchar](50) NULL,
	[State] [varchar](100) NULL,
	[Country] [varchar](100) NULL,
	[CreatedDate] [datetime] NOT NULL,
	[UpdatedDate] [datetime] NULL,
	[UPI] [varchar](100) NULL,
 CONSTRAINT [PK__BillingS__3214EC075E03417C] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[InvoiceDetails]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InvoiceDetails](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[InvoiceId] [bigint] NOT NULL,
	[ItemId] [bigint] NOT NULL,
	[ItemName] [varchar](200) NOT NULL,
	[HsnCode] [varchar](50) NOT NULL,
	[Quantity] [decimal](18, 2) NOT NULL,
	[Rate] [decimal](18, 2) NOT NULL,
	[Amount] [decimal](18, 2) NOT NULL,
	[GSTPercent] [int] NOT NULL,
	[GSTAmount] [decimal](18, 2) NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[CGSTAmount] [decimal](18, 2) NULL,
	[SGSTAmount] [decimal](18, 2) NULL,
	[IGSTAmount] [decimal](18, 2) NOT NULL CONSTRAINT DF_InvoiceDetails_IGSTAmount DEFAULT ((0)),
	[IsDeleted] [bit] NOT NULL CONSTRAINT DF_InvoiceDetails_IsDeleted DEFAULT ((0)),
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[InvoiceMaster]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InvoiceMaster](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[InvoiceNo] [varchar](50) NOT NULL,
	[InvoiceDate] [date] NOT NULL,
	[PartyId] [bigint] NOT NULL,
	[PartyName] [varchar](200) NOT NULL,
	[PartyAddress] [varchar](500) NULL,
	[PartyCity] [varchar](100) NULL,
	[PartyState] [varchar](100) NULL,
	[PartyPinCode] [varchar](20) NULL,
	[PartyGSTIN] [varchar](50) NULL,
	[Subtotal] [decimal](18, 2) NOT NULL,
	[TotalGST] [decimal](18, 2) NOT NULL,
	[GrandTotal] [decimal](18, 2) NOT NULL,
	[Notes] [varchar](500) NULL,
	[CreatedDate] [datetime] NOT NULL,
	[UpdatedDate] [datetime] NULL,
	[IsDeleted] [bit] NOT NULL,
	[GSTPercent] [decimal](5, 2) NOT NULL,
	[CompanyId] [int] NULL,
	[PaymentStatus] [tinyint] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ItemMaster]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ItemMaster](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ItemName] [nvarchar](200) NOT NULL,
	[HsnCode] [nvarchar](50) NOT NULL,
	[Rate] [decimal](18, 2) NOT NULL,
	[GST] [int] NOT NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime] NULL,
	[IsDeleted] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LoginAttempts]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LoginAttempts](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Email] [varchar](255) NOT NULL,
	[IpAddress] [varchar](45) NULL,
	[AttemptTime] [datetime2](7) NOT NULL,
	[WasSuccessful] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Party]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Party](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PartyName] [nvarchar](200) NOT NULL,
	[Address] [nvarchar](500) NULL,
	[City] [nvarchar](100) NULL,
	[State] [nvarchar](100) NULL,
	[PinCode] [nvarchar](20) NULL,
	[GSTIN] [nvarchar](50) NULL,
	[Mobile] [nvarchar](20) NULL,
	[Email] [nvarchar](100) NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime] NULL,
	[IsDeleted] [bit] NOT NULL,
	[CompanyId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RefreshTokens]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RefreshTokens](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Token] [varchar](500) NOT NULL,
	[ExpiryDate] [datetime2](7) NOT NULL,
	[IsRevoked] [bit] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UpdatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Token] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](100) NOT NULL,
	[Email] [varchar](255) NOT NULL,
	[PasswordHash] [varchar](255) NOT NULL,
	[FullName] [varchar](200) NOT NULL,
	[Company] [varchar](255) NULL,
	[Role] [varchar](50) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[LastLogin] [datetime2](7) NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UpdatedAt] [datetime2](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ActivityLogs] ADD  CONSTRAINT [DF_ActivityLogs_CreatedAt]  DEFAULT (getutcdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[BillingSettings] ADD  CONSTRAINT [DF__BillingSe__Creat__49C3F6B7]  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[InvoiceDetails] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[InvoiceMaster] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[InvoiceMaster] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[InvoiceMaster] ADD  DEFAULT ((18)) FOR [GSTPercent]
GO
ALTER TABLE [dbo].[ItemMaster] ADD  DEFAULT ((18)) FOR [GST]
GO
ALTER TABLE [dbo].[ItemMaster] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[ItemMaster] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[LoginAttempts] ADD  DEFAULT (getutcdate()) FOR [AttemptTime]
GO
ALTER TABLE [dbo].[LoginAttempts] ADD  DEFAULT ((0)) FOR [WasSuccessful]
GO
ALTER TABLE [dbo].[Party] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Party] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[RefreshTokens] ADD  DEFAULT ((0)) FOR [IsRevoked]
GO
ALTER TABLE [dbo].[RefreshTokens] ADD  DEFAULT (getutcdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ('User') FOR [Role]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getutcdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getutcdate()) FOR [UpdatedAt]
GO
ALTER TABLE [dbo].[InvoiceDetails]  WITH CHECK ADD  CONSTRAINT [FK_InvoiceDetails_InvoiceMaster] FOREIGN KEY([InvoiceId])
REFERENCES [dbo].[InvoiceMaster] ([Id])
GO
ALTER TABLE [dbo].[InvoiceDetails] CHECK CONSTRAINT [FK_InvoiceDetails_InvoiceMaster]
GO
ALTER TABLE [dbo].[RefreshTokens]  WITH CHECK ADD  CONSTRAINT [FK_RefreshTokens_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[RefreshTokens] CHECK CONSTRAINT [FK_RefreshTokens_Users]
GO
/****** Object:  StoredProcedure [dbo].[GetSalesSummary]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 8. GetSalesSummary - Get monthly sales summary as string
-- =============================================
CREATE PROCEDURE [dbo].[GetSalesSummary]
    @CompanyID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Result NVARCHAR(MAX);
    
    WITH MonthlySales AS (
        SELECT 
            FORMAT(InvoiceDate, 'MMM yyyy') AS Month,
            SUM(TotalAmount) AS TotalSales
        FROM Invoices
        WHERE CompanyId = @CompanyID 
            AND IsDeleted = 0
            AND InvoiceDate >= DATEADD(MONTH, -12, GETDATE())
        GROUP BY YEAR(InvoiceDate), MONTH(InvoiceDate), FORMAT(InvoiceDate, 'MMM yyyy')
    )
    SELECT @Result = STRING_AGG(
        CAST(Month AS NVARCHAR(20)) + ': ₹' + CAST(CAST(TotalSales AS BIGINT) AS NVARCHAR(20)), 
        ' | '
    ) FROM MonthlySales
    ORDER BY Month;
    
    SELECT ISNULL(@Result, 'No sales data available') AS Summary;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetActivityLogFilters]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Get filter options for dropdowns
CREATE   PROCEDURE [dbo].[sp_GetActivityLogFilters]
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get distinct actions
    SELECT DISTINCT Action AS Value, Action AS Label 
    FROM ActivityLogs 
    WHERE Action IS NOT NULL 
    ORDER BY Action;
    
    -- Get distinct entities
    SELECT DISTINCT Entity AS Value, Entity AS Label 
    FROM ActivityLogs 
    WHERE Entity IS NOT NULL 
    ORDER BY Entity;
    
    -- Get distinct users (if Users table exists)
    -- SELECT DISTINCT UserId, Username FROM Users WHERE IsActive = 1 ORDER BY Username;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetActivityLogsReport]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[sp_GetActivityLogsReport] --null,2
    @UserId INT = NULL,
    @CompanyId INT = NULL,
    @Action VARCHAR(50) = NULL,
    @Entity VARCHAR(100) = NULL,
    @FromDate DATETIME = NULL,
    @ToDate DATETIME = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @SortColumn VARCHAR(50) = 'CreatedAt',
    @SortDirection VARCHAR(4) = 'DESC'
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Calculate offset
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    -- Build the base query
    ;WITH ActivityLogsCTE AS (
        SELECT 
            Id,
            UserId,
            CompanyId,
            Action,
            Entity,
            EntityId,
            OldValues,
            NewValues,
            RequestBody,
            Parameters,
            IpAddress,
            UserAgent,
            RequestUrl,
            RequestMethod,
            ResponseStatus,
            ExecutionTimeMs,
            CreatedAt,
            -- Get user name if Users table exists
            (SELECT TOP 1 Username FROM Users WHERE Id = ActivityLogs.UserId) AS UserName,
            -- Get company name if Companies table exists
            (SELECT TOP 1 CompanyName FROM [dbo].[BillingSettings] WHERE Id = ActivityLogs.CompanyId) AS CompanyName,
            -- Extract request method for filtering
            RequestMethod AS Method
        FROM ActivityLogs
        WHERE 1=1
            AND (@UserId IS NULL OR UserId = @UserId)
            AND ( CompanyId = @CompanyId)
            AND (@Action IS NULL OR Action LIKE '%' + @Action + '%')
            AND (@Entity IS NULL OR Entity LIKE '%' + @Entity + '%')
            AND (@FromDate IS NULL OR CreatedAt >= @FromDate)
            AND (@ToDate IS NULL OR CreatedAt <= @ToDate)
    )
    -- Get total count for pagination
    SELECT 
        Id,
        UserId,
        UserName,
        CompanyId,
        CompanyName,
        Action,
        Entity,
        EntityId,
        OldValues,
        NewValues,
        RequestBody,
        Parameters,
        IpAddress,
        UserAgent,
        RequestUrl,
        RequestMethod AS Method,
        ResponseStatus,
        ExecutionTimeMs,
        CreatedAt,
        -- Truncate long values for display
        CASE 
            WHEN LEN(OldValues) > 200 THEN LEFT(OldValues, 200) + '...' 
            ELSE OldValues 
        END AS OldValuesShort,
        CASE 
            WHEN LEN(NewValues) > 200 THEN LEFT(NewValues, 200) + '...' 
            ELSE NewValues 
        END AS NewValuesShort,
        COUNT(*) OVER() AS TotalRecords
    FROM ActivityLogsCTE
    ORDER BY 
        CASE WHEN @SortColumn = 'Id' AND @SortDirection = 'ASC' THEN Id END ASC,
        CASE WHEN @SortColumn = 'Id' AND @SortDirection = 'DESC' THEN Id END DESC,
        CASE WHEN @SortColumn = 'UserName' AND @SortDirection = 'ASC' THEN UserName END ASC,
        CASE WHEN @SortColumn = 'UserName' AND @SortDirection = 'DESC' THEN UserName END DESC,
        CASE WHEN @SortColumn = 'Action' AND @SortDirection = 'ASC' THEN Action END ASC,
        CASE WHEN @SortColumn = 'Action' AND @SortDirection = 'DESC' THEN Action END DESC,
        CASE WHEN @SortColumn = 'Entity' AND @SortDirection = 'ASC' THEN Entity END ASC,
        CASE WHEN @SortColumn = 'Entity' AND @SortDirection = 'DESC' THEN Entity END DESC,
        CASE WHEN @SortColumn = 'CreatedAt' AND @SortDirection = 'ASC' THEN CreatedAt END ASC,
        CASE WHEN @SortColumn = 'CreatedAt' AND @SortDirection = 'DESC' THEN CreatedAt END DESC,
        CASE WHEN @SortColumn = 'ResponseStatus' AND @SortDirection = 'ASC' THEN ResponseStatus END ASC,
        CASE WHEN @SortColumn = 'ResponseStatus' AND @SortDirection = 'DESC' THEN ResponseStatus END DESC,
        CASE WHEN @SortColumn = 'ExecutionTimeMs' AND @SortDirection = 'ASC' THEN ExecutionTimeMs END ASC,
        CASE WHEN @SortColumn = 'ExecutionTimeMs' AND @SortDirection = 'DESC' THEN ExecutionTimeMs END DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetCompleteDashboardData]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 10. sp_GetCompleteDashboardData - Get all dashboard data in one call
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetCompleteDashboardData]
    @FilterType NVARCHAR(20) = 'today',
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @CompanyId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Calculate date range
    DECLARE @CalculatedStartDate DATE, @CalculatedEndDate DATE;
    
    IF @StartDate IS NOT NULL AND @EndDate IS NOT NULL
    BEGIN
        SET @CalculatedStartDate = @StartDate;
        SET @CalculatedEndDate = @EndDate;
    END
    ELSE
    BEGIN
        SET @CalculatedEndDate = CAST(GETDATE() AS DATE);
        
        IF @FilterType = 'today'
            SET @CalculatedStartDate = CAST(GETDATE() AS DATE);
        ELSE IF @FilterType = 'week'
            SET @CalculatedStartDate = DATEADD(DAY, -7, GETDATE());
        ELSE IF @FilterType = 'month'
            SET @CalculatedStartDate = DATEADD(MONTH, -1, GETDATE());
        ELSE IF @FilterType = 'year'
            SET @CalculatedStartDate = DATEADD(YEAR, -1, GETDATE());
        ELSE
            SET @CalculatedStartDate = DATEADD(DAY, -30, GETDATE());
    END
    
    -- Result Set 1: Dashboard Stats
    SELECT 
        ISNULL(SUM(i.TotalAmount), 0) AS TotalRevenue,
        COUNT(DISTINCT i.Id) AS TotalInvoices,
        ISNULL(AVG(i.TotalAmount), 0) AS AvgInvoiceValue,
        ISNULL(SUM(i.TotalGST), 0) AS TotalGSTCollected,
        COUNT(DISTINCT i.PartyId) AS UniqueCustomers,
        SUM(CASE WHEN i.Status = 'Paid' THEN 1 ELSE 0 END) AS PaidInvoices,
        SUM(CASE WHEN i.Status = 'Pending' THEN 1 ELSE 0 END) AS PendingInvoices
    FROM Invoices i
    WHERE i.InvoiceDate >= @CalculatedStartDate 
        AND i.InvoiceDate <= @CalculatedEndDate
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
        AND i.IsDeleted = 0;
    
    -- Result Set 2: Date Range
    SELECT @CalculatedStartDate AS StartDate, @CalculatedEndDate AS EndDate;
    
    -- Result Set 3: Monthly Revenue Trend
    SELECT 
        YEAR(i.InvoiceDate) * 100 + MONTH(i.InvoiceDate) AS Period,
        FORMAT(i.InvoiceDate, 'MMM yyyy') AS PeriodLabel,
        ISNULL(SUM(i.TotalAmount), 0) AS Revenue,
        COUNT(DISTINCT i.Id) AS InvoiceCount,
        ISNULL(SUM(i.TotalGST), 0) AS GSTCollected
    FROM Invoices i
    WHERE i.InvoiceDate >= @CalculatedStartDate 
        AND i.InvoiceDate <= @CalculatedEndDate
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
        AND i.IsDeleted = 0
    GROUP BY YEAR(i.InvoiceDate), MONTH(i.InvoiceDate), FORMAT(i.InvoiceDate, 'MMM yyyy')
    ORDER BY YEAR(i.InvoiceDate), MONTH(i.InvoiceDate);
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetCustomerPurchaseHistory]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 12. sp_GetCustomerPurchaseHistory - Customer purchase history
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetCustomerPurchaseHistory]
    @CustomerId INT,
    @CompanyId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        i.InvoiceNo,
        i.InvoiceDate,
        i.TotalAmount,
        i.TotalGST,
        i.Status,
        COUNT(iit.Id) AS ItemCount
    FROM Invoices i
    LEFT JOIN InvoiceItems iit ON i.Id = iit.InvoiceId AND iit.IsDeleted = 0
    WHERE i.PartyId = @CustomerId
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
        AND i.IsDeleted = 0
    GROUP BY i.InvoiceNo, i.InvoiceDate, i.TotalAmount, i.TotalGST, i.Status
    ORDER BY i.InvoiceDate DESC;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetDailySalesReport]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 13. sp_GetDailySalesReport - Daily sales report
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetDailySalesReport]
    @ReportDate DATE = NULL,
    @CompanyId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @ReportDate IS NULL
        SET @ReportDate = CAST(GETDATE() AS DATE);
    
    SELECT 
        i.InvoiceNo,
        i.PartyName,
        i.InvoiceDate,
        i.TotalAmount,
        i.TotalGST,
        i.Status,
        COUNT(iit.Id) AS ItemCount,
        SUM(iit.Quantity) AS TotalQuantity
    FROM Invoices i
    LEFT JOIN InvoiceItems iit ON i.Id = iit.InvoiceId AND iit.IsDeleted = 0
    WHERE CAST(i.InvoiceDate AS DATE) = @ReportDate
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
        AND i.IsDeleted = 0
    GROUP BY i.InvoiceNo, i.PartyName, i.InvoiceDate, i.TotalAmount, i.TotalGST, i.Status
    ORDER BY i.InvoiceNo;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetDashboardStats]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- 1. sp_GetDashboardStats - Get main dashboard statistics
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetDashboardStats]
    @FilterType NVARCHAR(20) = 'today', -- today, week, month, year, custom
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @CompanyId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Calculate date range based on filter
    DECLARE @CalculatedStartDate DATE, @CalculatedEndDate DATE;
    
    IF @StartDate IS NOT NULL AND @EndDate IS NOT NULL
    BEGIN
        SET @CalculatedStartDate = @StartDate;
        SET @CalculatedEndDate = @EndDate;
    END
    ELSE
    BEGIN
        SET @CalculatedEndDate = CAST(GETDATE() AS DATE);
        
        IF @FilterType = 'today'
            SET @CalculatedStartDate = CAST(GETDATE() AS DATE);
        ELSE IF @FilterType = 'week'
            SET @CalculatedStartDate = DATEADD(DAY, -7, GETDATE());
        ELSE IF @FilterType = 'month'
            SET @CalculatedStartDate = DATEADD(MONTH, -1, GETDATE());
        ELSE IF @FilterType = 'year'
            SET @CalculatedStartDate = DATEADD(YEAR, -1, GETDATE());
        ELSE
            SET @CalculatedStartDate = DATEADD(DAY, -30, GETDATE());
    END
    
    -- Main statistics
    SELECT 
        ISNULL(SUM(i.GrandTotal), 0) AS TotalRevenue,
        COUNT(DISTINCT i.Id) AS TotalInvoices,
        ISNULL(AVG(i.GrandTotal), 0) AS AvgInvoiceValue,
        ISNULL(SUM(i.TotalGST), 0) AS TotalGSTCollected,
        COUNT(DISTINCT i.PartyId) AS UniqueCustomers,
        SUM(CASE WHEN 'Paid' = 'Paid' THEN 1 ELSE 0 END) AS PaidInvoices,
        SUM(CASE WHEN 'Pending' = 'Pending' THEN 1 ELSE 0 END) AS PendingInvoices
    FROM InvoiceMaster i
    WHERE i.InvoiceDate >= @CalculatedStartDate 
        AND i.InvoiceDate <= @CalculatedEndDate
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
        AND i.IsDeleted = 0;
    
    -- Return date range for reference
    SELECT @CalculatedStartDate AS StartDate, @CalculatedEndDate AS EndDate;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetDateRange]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 2. sp_GetDateRange - Get calculated date range based on filter
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetDateRange]
    @FilterType NVARCHAR(20) = 'today',
    @StartDate DATE = NULL,
    @EndDate DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @CalculatedStartDate DATE, @CalculatedEndDate DATE;
    
    IF @StartDate IS NOT NULL AND @EndDate IS NOT NULL
    BEGIN
        SET @CalculatedStartDate = @StartDate;
        SET @CalculatedEndDate = @EndDate;
    END
    ELSE
    BEGIN
        SET @CalculatedEndDate = CAST(GETDATE() AS DATE);
        
        IF @FilterType = 'today'
            SET @CalculatedStartDate = CAST(GETDATE() AS DATE);
        ELSE IF @FilterType = 'week'
            SET @CalculatedStartDate = DATEADD(DAY, -7, GETDATE());
        ELSE IF @FilterType = 'month'
            SET @CalculatedStartDate = DATEADD(MONTH, -1, GETDATE());
        ELSE IF @FilterType = 'year'
            SET @CalculatedStartDate = DATEADD(YEAR, -1, GETDATE());
        ELSE
            SET @CalculatedStartDate = DATEADD(DAY, -30, GETDATE());
    END
    
    SELECT @CalculatedStartDate AS StartDate, @CalculatedEndDate AS EndDate;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetGSTReport]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Stored Procedure: sp_GetGSTReport
-- Description: Generates GST report with 4 result sets:
--   1. Invoice-wise GST details
--   2. GST Summary (totals)
--   3. HSN-wise summary
--   4. Party-wise GST summary
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetGSTReport]
    @StartDate DATE,
    @EndDate DATE,
    @CompanyId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- =============================================
    -- RESULT SET 1: Invoice-wise GST Details
    -- =============================================
    SELECT
        i.Id AS InvoiceId,
        i.InvoiceNo AS InvoiceNumber,
        i.InvoiceDate AS InvoiceDate,
        CASE WHEN ISNULL(p.GSTIN, '') = '' THEN 'B2C' ELSE 'B2B' END AS InvoiceType,
        ISNULL(p.PartyName, i.PartyName) AS PartyName,
        ISNULL(p.GSTIN, i.PartyGSTIN) AS PartyGstin,
        ISNULL(p.State, i.PartyState) AS PartyStateCode,
        ISNULL(p.State, i.PartyState) AS PartyState,
        i.Subtotal AS TaxableAmount,
        COALESCE(i.TotalGST, 0) / 2 AS CGSTAmount,
        COALESCE(i.TotalGST, 0) / 2 AS SGSTAmount,
        0 AS IGSTAmount,
        i.TotalGST AS TotalGST,
        i.GrandTotal AS TotalAmount,
        i.PaymentStatus AS PaymentStatus,
        i.PartyState AS PlaceOfSupply,
        0 AS ReverseCharge,
        '' AS EInvoiceStatus,
        '' AS IRN,
        '' AS AckNo,
        NULL AS AckDate
    FROM InvoiceMaster i
    LEFT JOIN Party p ON i.PartyId = p.Id
    WHERE i.InvoiceDate BETWEEN @StartDate AND @EndDate
        AND i.IsDeleted = 0
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
    ORDER BY i.InvoiceDate DESC, i.InvoiceNo;

    -- =============================================
    -- RESULT SET 2: GST Summary (Totals)
    -- =============================================
    SELECT
        COUNT(i.Id) AS TotalInvoices,
        SUM(i.Subtotal) AS TotalTaxableAmount,
        SUM(COALESCE(i.TotalGST, 0) / 2) AS TotalCGST,
        SUM(COALESCE(i.TotalGST, 0) / 2) AS TotalSGST,
        0 AS TotalIGST,
        SUM(COALESCE(i.TotalGST, 0)) AS TotalGST,
        SUM(COALESCE(i.GrandTotal, 0)) AS GrandTotal,
        SUM(CASE WHEN i.PaymentStatus = 1 THEN 1 ELSE 0 END) AS PaidInvoices,
        SUM(CASE WHEN i.PaymentStatus = 2 THEN 1 ELSE 0 END) AS PartialInvoices,
        SUM(CASE WHEN i.PaymentStatus = 0 THEN 1 ELSE 0 END) AS UnpaidInvoices
    FROM InvoiceMaster i
    WHERE i.InvoiceDate BETWEEN @StartDate AND @EndDate
        AND i.IsDeleted = 0
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId);

    -- =============================================
    -- RESULT SET 3: HSN-wise Summary
    -- =============================================
    SELECT
        id.HsnCode AS HSNCode,
        id.ItemName AS Description,
        SUM(id.Amount) AS TaxableAmount,
        SUM(ISNULL(id.GSTAmount, 0) / 2) AS CGSTAmount,
        SUM(ISNULL(id.GSTAmount, 0) / 2) AS SGSTAmount,
        0 AS IGSTAmount,
        SUM(ISNULL(id.GSTAmount, 0)) AS TotalGST,
        SUM(id.Quantity) AS TotalQuantity,
        AVG(id.Rate) AS AverageRate,
        COUNT(DISTINCT id.InvoiceId) AS InvoiceCount
    FROM InvoiceDetails id
    INNER JOIN InvoiceMaster i ON id.InvoiceId = i.Id
    WHERE i.InvoiceDate BETWEEN @StartDate AND @EndDate
        AND i.IsDeleted = 0
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
    GROUP BY id.HsnCode, id.ItemName
    ORDER BY TotalGST DESC;

    -- =============================================
    -- RESULT SET 4: Party-wise GST Summary
    -- =============================================
    SELECT
        ISNULL(p.Id, 0) AS PartyId,
        ISNULL(p.PartyName, i.PartyName) AS PartyName,
        ISNULL(p.GSTIN, i.PartyGSTIN) AS PartyGstin,
        ISNULL(p.State, i.PartyState) AS PartyStateCode,
        ISNULL(p.State, i.PartyState) AS PartyState,
        COUNT(i.Id) AS InvoiceCount,
        SUM(i.Subtotal) AS TaxableAmount,
        SUM(COALESCE(i.TotalGST, 0) / 2) AS CGSTAmount,
        SUM(COALESCE(i.TotalGST, 0) / 2) AS SGSTAmount,
        0 AS IGSTAmount,
        SUM(COALESCE(i.TotalGST, 0)) AS TotalGST,
        SUM(COALESCE(i.GrandTotal, 0)) AS TotalAmount,
        SUM(CASE WHEN i.PaymentStatus = 1 THEN COALESCE(i.GrandTotal, 0) ELSE 0 END) AS PaidAmount,
        SUM(CASE WHEN i.PaymentStatus = 2 THEN COALESCE(i.GrandTotal, 0) ELSE 0 END) AS PartialAmount,
        SUM(CASE WHEN i.PaymentStatus = 0 THEN COALESCE(i.GrandTotal, 0) ELSE 0 END) AS UnpaidAmount
    FROM InvoiceMaster i
    LEFT JOIN Party p ON i.PartyId = p.Id
    WHERE i.InvoiceDate BETWEEN @StartDate AND @EndDate
        AND i.IsDeleted = 0
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
    GROUP BY ISNULL(p.Id, 0), ISNULL(p.PartyName, i.PartyName), ISNULL(p.GSTIN, i.PartyGSTIN), ISNULL(p.State, i.PartyState)
    ORDER BY TotalGST DESC;

END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetCompanyDetails]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetCompanyDetails]
    @CompanyId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        CompanyName,
        GSTIN,
        State AS CompanyState,
        Address AS CompanyAddress,
        City AS CompanyCity,
        PinCode AS CompanyPinCode,
        Country AS CompanyCountry,
        MobileNumber AS CompanyPhone,
        UPI AS CompanyUPI,
        '' AS CompanyPAN,
        '' AS CompanyStateCode
    FROM BillingSettings
    ORDER BY Id;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetInventoryReport]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 15. sp_GetInventoryReport - Inventory/Item sales report
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetInventoryReport]
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @CompanyId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @StartDate IS NULL
        SET @StartDate = DATEADD(MONTH, -1, GETDATE());
    IF @EndDate IS NULL
        SET @EndDate = GETDATE();
    
    SELECT 
        iit.ItemName,
        iit.HsnCode,
        SUM(iit.Quantity) AS TotalQuantitySold,
        SUM(iit.Amount) AS TotalRevenue,
        AVG(iit.Rate) AS AveragePrice,
        COUNT(DISTINCT i.Id) AS InvoiceCount
    FROM InvoiceItems iit
    INNER JOIN Invoices i ON iit.InvoiceId = i.Id
    WHERE i.InvoiceDate >= @StartDate 
        AND i.InvoiceDate <= @EndDate
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
        AND i.IsDeleted = 0
        AND iit.IsDeleted = 0
    GROUP BY iit.ItemName, iit.HsnCode
    ORDER BY TotalRevenue DESC;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetInvoiceById]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 6. sp_GetInvoiceById - Get single invoice with details
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetInvoiceById]
    @InvoiceId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id, InvoiceNo, CompanyId, UserId, PartyId,
        PartyName, PartyAddress, PartyCity, PartyPinCode, PartyState, PartyGSTIN,
        InvoiceDate, Subtotal, TotalGST, TotalAmount, GstPercent,
        Status, Notes, CreatedAt, UpdatedAt, IsDeleted
    FROM Invoices
    WHERE Id = @InvoiceId AND IsDeleted = 0;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetInvoiceItems]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 7. sp_GetInvoiceItems - Get invoice items
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetInvoiceItems]
    @InvoiceId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id, InvoiceId, ProductId, ItemName, HsnCode,
        Quantity, Rate, Amount, Discount, Tax, IsDeleted
    FROM InvoiceItems
    WHERE InvoiceId = @InvoiceId AND IsDeleted = 0
    ORDER BY Id;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetRecentInvoices]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 5. sp_GetRecentInvoices - Get recent invoices
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetRecentInvoices]
    @Count INT = 10,
    @CompanyId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP (@Count)
        i.Id,
        i.InvoiceNo,
        i.PartyName,
        ISNULL(i.PartyGSTIN, '') AS PartyGSTIN,
        i.InvoiceDate,
        i.GrandTotal,
        i.TotalGST,
          CASE 
            WHEN i.PaymentStatus = 1 THEN 'Paid'
            WHEN i.PaymentStatus = 2 THEN 'Partially Paid'
            WHEN i.PaymentStatus = 3 THEN 'Unpaid'
            ELSE 'Pending'
        END AS Status,
        (
            SELECT COUNT(*) 
            FROM  [dbo].[InvoiceDetails]
            WHERE InvoiceId = i.Id AND IsDeleted = 0
        ) AS ItemCount
    FROM  [dbo].[InvoiceMaster] i
    WHERE (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
        AND i.IsDeleted = 0
    ORDER BY i.InvoiceDate DESC, i.Id DESC;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetRevenueTrend]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 3. sp_GetRevenueTrend - Get revenue trend by period
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetRevenueTrend]
    @TrendType NVARCHAR(20) = 'daily', -- daily, weekly, monthly, yearly
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @CompanyId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @StartDate IS NULL
        SET @StartDate = DATEADD(DAY, -30, GETDATE());
    IF @EndDate IS NULL
        SET @EndDate = GETDATE();
    
    IF @TrendType = 'daily'
    BEGIN
        SELECT 
            CAST(i.InvoiceDate AS DATE) AS Period,
            FORMAT(i.InvoiceDate, 'dd/MM') AS PeriodLabel,
            ISNULL(SUM(i.GrandTotal), 0) AS Revenue,
            COUNT(DISTINCT i.Id) AS InvoiceCount,
            ISNULL(SUM(i.TotalGST), 0) AS GSTCollected
        FROM InvoiceMaster i
        WHERE i.InvoiceDate >= @StartDate 
            AND i.InvoiceDate <= @EndDate
            AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
            AND i.IsDeleted = 0
        GROUP BY CAST(i.InvoiceDate AS DATE), FORMAT(i.InvoiceDate, 'dd/MM')
        ORDER BY Period;
    END
    ELSE IF @TrendType = 'weekly'
    BEGIN
        SELECT 
            DATEPART(WEEK, i.InvoiceDate) AS Period,
            'Week ' + CAST(DATEPART(WEEK, i.InvoiceDate) AS VARCHAR) AS PeriodLabel,
            ISNULL(SUM(i.GrandTotal), 0) AS Revenue,
            COUNT(DISTINCT i.Id) AS InvoiceCount,
            ISNULL(SUM(i.TotalGST), 0) AS GSTCollected
        FROM InvoiceMaster i
        WHERE i.InvoiceDate >= @StartDate 
            AND i.InvoiceDate <= @EndDate
            AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
            AND i.IsDeleted = 0
        GROUP BY DATEPART(WEEK, i.InvoiceDate)
        ORDER BY Period;
    END
    ELSE IF @TrendType = 'monthly'
    BEGIN
        SELECT 
            YEAR(i.InvoiceDate) * 100 + MONTH(i.InvoiceDate) AS Period,
            FORMAT(i.InvoiceDate, 'MMM yyyy') AS PeriodLabel,
            ISNULL(SUM(i.GrandTotal), 0) AS Revenue,
            COUNT(DISTINCT i.Id) AS InvoiceCount,
            ISNULL(SUM(i.TotalGST), 0) AS GSTCollected
        FROM InvoiceMaster i
        WHERE i.InvoiceDate >= @StartDate 
            AND i.InvoiceDate <= @EndDate
            AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
            AND i.IsDeleted = 0
        GROUP BY YEAR(i.InvoiceDate), MONTH(i.InvoiceDate), FORMAT(i.InvoiceDate, 'MMM yyyy')
        ORDER BY YEAR(i.InvoiceDate), MONTH(i.InvoiceDate);
    END
    ELSE IF @TrendType = 'yearly'
    BEGIN
        SELECT 
            YEAR(i.InvoiceDate) AS Period,
            CAST(YEAR(i.InvoiceDate) AS NVARCHAR(4)) AS PeriodLabel,
            ISNULL(SUM(i.GrandTotal), 0) AS Revenue,
            COUNT(DISTINCT i.Id) AS InvoiceCount,
            ISNULL(SUM(i.TotalGST), 0) AS GSTCollected
        FROM InvoiceMaster i
        WHERE i.InvoiceDate >= @StartDate 
            AND i.InvoiceDate <= @EndDate
            AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
            AND i.IsDeleted = 0
        GROUP BY YEAR(i.InvoiceDate)
        ORDER BY Period;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetSalesByPaymentMode]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 11. sp_GetSalesByPaymentMode - Sales breakdown by payment mode
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetSalesByPaymentMode]
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @CompanyId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @StartDate IS NULL
        SET @StartDate = DATEADD(MONTH, -1, GETDATE());
    IF @EndDate IS NULL
        SET @EndDate = GETDATE();
    
    SELECT 
        ISNULL(PaymentMode, 'Other') AS PaymentMode,
        COUNT(*) AS TransactionCount,
        SUM(TotalAmount) AS TotalAmount,
        AVG(TotalAmount) AS AvgAmount
    FROM Invoices
    WHERE InvoiceDate >= @StartDate 
        AND InvoiceDate <= @EndDate
        AND (@CompanyId IS NULL OR CompanyId = @CompanyId)
        AND IsDeleted = 0
    GROUP BY PaymentMode
    ORDER BY TotalAmount DESC;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetTopProducts]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 4. sp_GetTopProducts - Get top selling products
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetTopProducts]
    @TopCount INT = 5,
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @CompanyId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @StartDate IS NULL
        SET @StartDate = DATEADD(MONTH, -1, GETDATE());
    IF @EndDate IS NULL
        SET @EndDate = GETDATE();
    
    SELECT TOP (@TopCount)
        ISNULL(iit.ItemName, 'Unknown') AS ProductName,
        ISNULL(SUM(iit.Quantity), 0) AS TotalQuantity,
        ISNULL(SUM(iit.Amount), 0) AS TotalRevenue,
        COUNT(DISTINCT i.Id) AS InvoiceCount,
        ISNULL(AVG(iit.Rate), 0) AS AvgPrice
    FROM [dbo].[InvoiceDetails]  iit
    INNER JOIN [dbo].[InvoiceMaster] i ON iit.InvoiceId = i.Id
    WHERE i.InvoiceDate >= @StartDate 
        AND i.InvoiceDate <= @EndDate
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
        AND i.IsDeleted = 0
    GROUP BY iit.ItemName
    ORDER BY TotalRevenue DESC;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetTotalRevenueByDateRange]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 9. sp_GetTotalRevenueByDateRange - Get total revenue in date range
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetTotalRevenueByDateRange]
    @StartDate DATE,
    @EndDate DATE,
    @CompanyId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT ISNULL(SUM(TotalAmount), 0) AS TotalRevenue
    FROM Invoices
    WHERE InvoiceDate >= @StartDate 
        AND InvoiceDate <= @EndDate
        AND (@CompanyId IS NULL OR CompanyId = @CompanyId)
        AND IsDeleted = 0;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_InsertActivityLogs]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Create stored procedure for batch insert
CREATE PROCEDURE [dbo].[sp_InsertActivityLogs]
    @Logs dbo.ActivityLogType READONLY
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO ActivityLogs 
    (UserId, CompanyId, Action, Entity, EntityId,  OldValues, NewValues, 
     RequestBody, Parameters, IpAddress, UserAgent, RequestUrl, RequestMethod, 
     ResponseStatus, ExecutionTimeMs, CreatedAt)
    SELECT 
        UserId, CompanyId, Action, Entity, EntityId,  OldValues, NewValues,
        RequestBody, Parameters, IpAddress, UserAgent, RequestUrl, RequestMethod,
        ResponseStatus, ExecutionTimeMs, CreatedAt
    FROM @Logs;
    
    -- Return count of inserted records (optional)
    SELECT @@ROWCOUNT AS InsertedCount;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateRefreshToken]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_UpdateRefreshToken]
    @OldToken NVARCHAR(MAX),
    @NewToken NVARCHAR(MAX),
    @ExpiryDate DATETIME2,
    @UpdatedAt DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE RefreshTokens 
    SET Token = @NewToken, 
        ExpiryDate = @ExpiryDate, 
        UpdatedAt = @UpdatedAt
    WHERE Token = @OldToken;
    
    -- Optional: Return the number of rows affected
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_CheckEmailExists]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Check if email exists
-- =============================================
CREATE   PROCEDURE [dbo].[USP_CheckEmailExists]
    @Email VARCHAR(255),
    @ExcludeUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Count INT;
    
    IF @ExcludeUserId IS NULL
    BEGIN
        SELECT @Count = COUNT(1) FROM Users WHERE Email = @Email;
    END
    ELSE
    BEGIN
        SELECT @Count = COUNT(1) FROM Users WHERE Email = @Email AND Id != @ExcludeUserId;
    END
    
    SELECT @Count AS EmailExists;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_CheckUsernameExists]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Check if username exists
-- =============================================
CREATE   PROCEDURE [dbo].[USP_CheckUsernameExists]
    @Username VARCHAR(100),
    @ExcludeUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Count INT;
    
    IF @ExcludeUserId IS NULL
    BEGIN
        SELECT @Count = COUNT(1) FROM Users WHERE Username = @Username;
    END
    ELSE
    BEGIN
        SELECT @Count = COUNT(1) FROM Users WHERE Username = @Username AND Id != @ExcludeUserId;
    END
    
    SELECT @Count AS UsernameExists;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_CreateBillingSettings]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:      Your Name
-- Create date: 2024
-- Description: Create or Update Billing Settings based on Company Name
-- =============================================
CREATE PROCEDURE [dbo].[USP_CreateBillingSettings]
    @CompanyName NVARCHAR(200),
    @GSTIN NVARCHAR(50),
    @MobileNumber NVARCHAR(20),
    @Address NVARCHAR(500),
    @City NVARCHAR(100),
    @PinCode NVARCHAR(20),
    @State NVARCHAR(100),
    @Country NVARCHAR(100),
    @UPI varchar(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @ExistingId INT;
    
    -- Check if record with same CompanyName exists
    SELECT @ExistingId = Id 
    FROM BillingSettings WITH(NOLOCK)
    WHERE CompanyName = @CompanyName;
    
    -- If exists, update the record
    IF @ExistingId IS NOT NULL
    BEGIN
        UPDATE BillingSettings
        SET
            GSTIN = @GSTIN,
            MobileNumber = @MobileNumber,
            Address = @Address,
            City = @City,
            PinCode = @PinCode,
            State = @State,
            Country = @Country,
            UPI=@UPI,
            UpdatedDate = GETDATE()
        WHERE Id = @ExistingId;
        
        -- Return the existing Id
        SELECT @ExistingId AS Id;
    END
    -- If not exists, insert new record
    ELSE
    BEGIN
        INSERT INTO BillingSettings
        (
            CompanyName,
            GSTIN,
            MobileNumber,
            Address,
            City,
            PinCode,
            State,
            Country,
            UPI,
            CreatedDate
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
            @Country,
            @UPI,
            GETDATE()
        );
        
        -- Return the new Id
        SELECT CAST(SCOPE_IDENTITY() AS INT) AS Id;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[USP_CreateInvoice]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[USP_CreateInvoice]
    @InvoiceNo VARCHAR(50),
    @InvoiceDate DATE,
    @PartyId BIGINT,
    @PartyName VARCHAR(200),
    @PartyAddress VARCHAR(500) = NULL,
    @PartyCity VARCHAR(100) = NULL,
    @PartyState VARCHAR(100) = NULL,
    @PartyPinCode VARCHAR(20) = NULL,
    @PartyGSTIN VARCHAR(50) = NULL,
    @Subtotal DECIMAL(18,2),
    @GSTPercent DECIMAL(5,2),
    @Notes VARCHAR(500) = NULL,
    @CompanyId int,
    @PaymentStatus tinyint
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @InvoiceId BIGINT;
    DECLARE @TotalGST DECIMAL(18,2);
    DECLARE @GrandTotal DECIMAL(18,2);
    
    -- Calculate totals
    SET @TotalGST = (@Subtotal * @GSTPercent) / 100;
    SET @GrandTotal = @Subtotal + @TotalGST;
    
    INSERT INTO InvoiceMaster
    (
        InvoiceNo, InvoiceDate, PartyId, PartyName, PartyAddress,
        PartyCity, PartyState, PartyPinCode, PartyGSTIN,
        Subtotal, GSTPercent, TotalGST, GrandTotal, Notes, CreatedDate,CompanyId,PaymentStatus
    )
    VALUES
    (
        @InvoiceNo, @InvoiceDate, @PartyId, @PartyName, @PartyAddress,
        @PartyCity, @PartyState, @PartyPinCode, @PartyGSTIN,
        @Subtotal, @GSTPercent, @TotalGST, @GrandTotal, @Notes, GETDATE(),@CompanyId,@PaymentStatus
    );
    
    SET @InvoiceId = SCOPE_IDENTITY();
    SELECT @InvoiceId AS Id;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_CreateInvoiceDetails]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[USP_CreateInvoiceDetails]
    @InvoiceId BIGINT,
    @ItemId BIGINT,
    @ItemName VARCHAR(200),
    @HsnCode VARCHAR(50),
    @Quantity DECIMAL(18,2),
    @Rate DECIMAL(18,2),
    @Amount DECIMAL(18,2),
    @GSTPercent INT,
    @GSTAmount DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO InvoiceDetails
    (
        InvoiceId, ItemId, ItemName, HsnCode, Quantity,
        Rate, Amount, GSTPercent, GSTAmount, CGSTAmount, SGSTAmount, IGSTAmount, CreatedDate
    )
    VALUES
    (
        @InvoiceId, @ItemId, @ItemName, @HsnCode, @Quantity,
        @Rate, @Amount, @GSTPercent, @GSTAmount, (@GSTAmount / 2), (@GSTAmount / 2), 0, GETDATE()
    );
    
    SELECT CAST(SCOPE_IDENTITY() AS BIGINT) AS Id;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_CreateItemMaster]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_CreateItemMaster
-- =============================================
CREATE   PROCEDURE [dbo].[USP_CreateItemMaster]
    @ItemName NVARCHAR(200),
    @HsnCode NVARCHAR(50),
    @Rate DECIMAL(18,2),
    @GST INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if active item with same name already exists
    IF EXISTS (SELECT 1 FROM ItemMaster WHERE ItemName = @ItemName AND IsDeleted = 0)
    BEGIN
        SELECT -1 AS Id; -- Duplicate item name
        RETURN;
    END
    
    INSERT INTO ItemMaster
    (
        ItemName,
        HsnCode,
        Rate,
        GST,
        CreatedDate,
        IsDeleted
    )
    VALUES
    (
        @ItemName,
        @HsnCode,
        @Rate,
        @GST,
        GETDATE(),
        0
    );
    
    SELECT CAST(SCOPE_IDENTITY() AS INT) AS Id;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_CreateParty]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_CreateParty
-- =============================================
CREATE   PROCEDURE [dbo].[USP_CreateParty]
    @PartyName NVARCHAR(200),
    @Address NVARCHAR(500),
    @City NVARCHAR(100),
    @State NVARCHAR(100),
    @PinCode NVARCHAR(20),
    @GSTIN NVARCHAR(50),
    @Mobile NVARCHAR(20),
    @Email NVARCHAR(100),
    @CompanyId int 
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if active party with same GSTIN already exists
    IF EXISTS (SELECT 1 FROM Party WHERE GSTIN = @GSTIN AND IsDeleted = 0)
    BEGIN
        SELECT -1 AS Id; -- Duplicate GSTIN
        RETURN;
    END
    
    -- Check if active party with same name already exists
    IF EXISTS (SELECT 1 FROM Party WHERE PartyName = @PartyName AND IsDeleted = 0)
    BEGIN
        SELECT -2 AS Id; -- Duplicate Party Name
        RETURN;
    END
    
    INSERT INTO Party
    (
        PartyName,
        Address,
        City,
        State,
        PinCode,
        GSTIN,
        Mobile,
        Email,
        CreatedDate,
        IsDeleted,
        CompanyId
    )
    VALUES
    (
        @PartyName,
        @Address,
        @City,
        @State,
        @PinCode,
        @GSTIN,
        @Mobile,
        @Email,
        GETDATE(),
        0,
        @CompanyId
    );
    
    SELECT CAST(SCOPE_IDENTITY() AS INT) AS Id;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_CreateUser]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Create user
-- =============================================
CREATE   PROCEDURE [dbo].[USP_CreateUser]
    @Username VARCHAR(100),
    @Email VARCHAR(255),
    @PasswordHash VARCHAR(255),
    @FullName VARCHAR(200),
    @Company VARCHAR(255) = NULL,
    @Role VARCHAR(50) = 'User'
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
    BEGIN
        RETURN -1; -- Email already exists
    END
    
    IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username)
    BEGIN
        RETURN -2; -- Username already exists
    END
    
    INSERT INTO Users (Username, Email, PasswordHash, FullName, Company, Role, IsActive)
    VALUES (@Username, @Email, @PasswordHash, @FullName, @Company, @Role, 1);

    DECLARE @UserId INT = SCOPE_IDENTITY();

     INSERT INTO BillingSettings
        (
            CompanyName,
            CreatedDate,
            UserId
        )
        VALUES
        (
            @Company,
            GETDATE(),
            @UserId
        );
    
    RETURN @UserId;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_DeleteInvoice]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[USP_DeleteInvoice]
    @Id BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Soft delete the invoice
    UPDATE InvoiceMaster
    SET IsDeleted = 1,
        UpdatedDate = GETDATE()
    WHERE Id = @Id;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_DeleteItemMaster]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_DeleteItemMaster (Soft Delete)
-- =============================================
CREATE   PROCEDURE [dbo].[USP_DeleteItemMaster]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE ItemMaster
    SET IsDeleted = 1,
        UpdatedDate = GETDATE()
    WHERE Id = @Id;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_DeleteParty]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_DeleteParty (Soft Delete)
-- =============================================
CREATE   PROCEDURE [dbo].[USP_DeleteParty]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Party
    SET IsDeleted = 1,
        UpdatedDate = GETDATE()
    WHERE Id = @Id;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetActiveUsers]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Get active users only
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetActiveUsers]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id, 
        Username,
        Email, 
        FullName, 
        Company, 
        Role,
        IsActive, 
        LastLogin, 
        CreatedAt, 
        UpdatedAt
    FROM Users
    WHERE IsActive = 1
    ORDER BY FullName;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetAllInvoices]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[USP_GetAllInvoices]
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @Search VARCHAR(100) = NULL,
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @CompanyId int
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT 
        Id, InvoiceNo, InvoiceDate, PartyName, PartyGSTIN, PartyState,
        Subtotal, GSTPercent, TotalGST, GrandTotal, CreatedDate,PaymentStatus,
        COUNT(*) OVER() AS TotalCount
    FROM InvoiceMaster WITH(NOLOCK)
    WHERE IsDeleted = 0 AND CompanyId=@CompanyId
        AND (@Search IS NULL OR 
             InvoiceNo LIKE '%' + @Search + '%' OR
             PartyName LIKE '%' + @Search + '%' OR
             PartyGSTIN LIKE '%' + @Search + '%')
        AND (@StartDate IS NULL OR InvoiceDate >= @StartDate)
        AND (@EndDate IS NULL OR InvoiceDate <= @EndDate)
    ORDER BY Id DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetBillingSettings]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:      Your Name
-- Create date: 2024
-- Description: Get Billing Settings
-- =============================================
CREATE PROCEDURE [dbo].[USP_GetBillingSettings]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP 1 
        Id,
        CompanyName,
        GSTIN as gstin,
        MobileNumber,
        Address,
        City,
        PinCode,
        State,
        Country,
        UPI,
        CreatedDate,
        UpdatedDate
    FROM BillingSettings WITH(NOLOCK)
    ORDER BY Id DESC
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetInvoiceById]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[USP_GetInvoiceById]
    @Id BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get Invoice Master with GST split calculated based only on GSTPercent
    SELECT 
        Id, 
        InvoiceNo, 
        InvoiceDate, 
        PartyId, 
        PartyName,
        PartyAddress, 
        PartyCity, 
        PartyState, 
        PartyPinCode, 
        PartyGSTIN,
        Subtotal, 
        GSTPercent, 
        TotalGST, 
        GrandTotal, 
        Notes, 
        CreatedDate,
        -- Calculate CGST, SGST, IGST based solely on GSTPercent
        -- Assuming all transactions are intra-state (CGST + SGST)
        GSTPercent / 2 AS CGSTPercent,
        GSTPercent / 2 AS SGSTPercent,
        0 AS IGSTPercent,
        -- Calculate individual tax amounts
        TotalGST / 2 AS CGSTAmount,
        TotalGST / 2 AS SGSTAmount,
        0 AS IGSTAmount,
        PaymentStatus
    FROM InvoiceMaster WITH(NOLOCK)
    WHERE Id = @Id AND IsDeleted = 0;
    
    -- Get Invoice Details
    SELECT 
        Id, 
        InvoiceId, 
        ItemId, 
        ItemName, 
        HsnCode,
        Quantity, 
        Rate, 
        Amount, 
        CreatedDate
    FROM InvoiceDetails WITH(NOLOCK)
    WHERE InvoiceId = @Id
    ORDER BY Id ASC;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetInvoicesByDateRange]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[USP_GetInvoicesByDateRange]
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id, InvoiceNo, InvoiceDate, PartyName,
        Subtotal, TotalGST, GrandTotal, CreatedDate
    FROM InvoiceMaster WITH(NOLOCK)
    WHERE IsDeleted = 0 
        AND InvoiceDate BETWEEN @StartDate AND @EndDate
    ORDER BY InvoiceDate DESC, Id DESC;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetItemMaster]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- USP_GetItemMaster
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetItemMaster]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        ItemName,
        HsnCode,
        Rate,
        GST,
        CreatedDate,
        UpdatedDate,
        IsDeleted
    FROM ItemMaster WITH(NOLOCK)
    WHERE IsDeleted = 0
    ORDER BY ItemName ASC
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetItemMasterById]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_GetItemMasterById
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetItemMasterById]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        ItemName,
        HsnCode,
        Rate,
        GST,
        CreatedDate,
        UpdatedDate,
        IsDeleted
    FROM ItemMaster WITH(NOLOCK)
    WHERE Id = @Id AND IsDeleted = 0
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetParties]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- USP_GetParties
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetParties]
(
@CompanyId int
)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        PartyName,
        Address,
        City,
        State,
        PinCode,
        GSTIN,
        Mobile,
        Email,
        CreatedDate,
        UpdatedDate,
        IsDeleted
    FROM Party WITH(NOLOCK)
    WHERE CompanyId= @CompanyId and IsDeleted = 0
    ORDER BY PartyName ASC
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetPartyByGSTIN]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_GetPartyByGSTIN
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetPartyByGSTIN]
    @GSTIN NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        PartyName,
        Address,
        City,
        State,
        PinCode,
        GSTIN,
        Mobile,
        Email,
        CreatedDate,
        UpdatedDate,
        IsDeleted
    FROM Party WITH(NOLOCK)
    WHERE GSTIN = @GSTIN AND IsDeleted = 0
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetPartyById]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_GetPartyById
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetPartyById]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        PartyName,
        Address,
        City,
        State,
        PinCode,
        GSTIN,
        Mobile,
        Email,
        CreatedDate,
        UpdatedDate,
        IsDeleted
    FROM Party WITH(NOLOCK)
    WHERE Id = @Id AND IsDeleted = 0
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetRefreshToken]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Validate refresh token
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetRefreshToken]
    @Token VARCHAR(500)
    
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP 1 * FROM RefreshTokens WHERE Token = @Token
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetUserByEmail]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Get user by email
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetUserByEmail]
    @Email VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        Id, 
        Username,
        Email, 
        FullName, 
        Company, 
        Role,
        IsActive, 
        LastLogin, 
        CreatedAt, 
        UpdatedAt
    FROM Users
    WHERE Email = @Email;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetUserById]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Get user by ID
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetUserById]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        U.Id, 
        Username,
        Email, 
        FullName, 
        Company, 
        Role,
        IsActive, 
        LastLogin, 
        CreatedAt, 
        UpdatedAt,
        bs.Id as CompanyId
    FROM Users U join [dbo].[BillingSettings] bs on U.Id=bs.UserId
    WHERE U.Id = @Id;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetUserByUsername]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Get user by username
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetUserByUsername]
    @Username VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        Id, 
        Username,
        Email, 
        FullName, 
        Company, 
        Role,
        IsActive, 
        LastLogin, 
        CreatedAt, 
        UpdatedAt
    FROM Users
    WHERE Username = @Username;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetUserCount]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Get user count
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetUserCount]
    @IsActive BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Count INT;
    
    IF @IsActive IS NULL
    BEGIN
        SELECT @Count = COUNT(1) FROM Users;
    END
    ELSE
    BEGIN
        SELECT @Count = COUNT(1) FROM Users WHERE IsActive = @IsActive;
    END
    
    SELECT @Count AS UserCount;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetUsers]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Get all users
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetUsers]
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        Id, 
        Username,
        Email, 
        FullName, 
        Company, 
        Role,
        IsActive, 
        LastLogin, 
        CreatedAt, 
        UpdatedAt
    FROM Users
    ORDER BY CreatedAt DESC;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_RegisterUser]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Register user (with output parameters)
-- =============================================
CREATE   PROCEDURE [dbo].[USP_RegisterUser]
    @Username VARCHAR(100),
    @Email VARCHAR(255),
    @PasswordHash VARCHAR(255),
    @FullName VARCHAR(200),
    @Company VARCHAR(255) = NULL,
    @Role VARCHAR(50) = 'User'
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @UserId INT;
    DECLARE @Message VARCHAR(255);
    
    BEGIN TRY
        -- Check if email already exists
        IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
        BEGIN
            SELECT 
                NULL AS UserId, 
                'Email already registered' AS Message;
            RETURN;
        END
        
        -- Check if username already exists
        IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username)
        BEGIN
            SELECT 
                NULL AS UserId, 
                'Username already taken' AS Message;
            RETURN;
        END
        
        -- Insert new user
        INSERT INTO Users (Username, Email, PasswordHash, FullName, Company, Role, IsActive)
        VALUES (@Username, @Email, @PasswordHash, @FullName, @Company, @Role, 1);


        SET @UserId = SCOPE_IDENTITY();

     INSERT INTO BillingSettings
        (
            CompanyName,
            CreatedDate,
            UserId
        )
        VALUES
        (
            @Company,
            GETDATE(),
            @UserId
        );
        
        
        SET @Message = 'Registration successful';
        
        SELECT @UserId AS UserId, @Message AS Message;
    END TRY
    BEGIN CATCH
        SELECT 
            NULL AS UserId, 
            ERROR_MESSAGE() AS Message;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[USP_SearchItemMaster]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_SearchItemMaster
-- =============================================
CREATE   PROCEDURE [dbo].[USP_SearchItemMaster]
    @Keyword NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        ItemName,
        HsnCode,
        Rate,
        GST,
        CreatedDate,
        UpdatedDate,
        IsDeleted
    FROM ItemMaster WITH(NOLOCK)
    WHERE IsDeleted = 0 
        AND (ItemName LIKE '%' + @Keyword + '%' 
        OR HsnCode LIKE '%' + @Keyword + '%')
    ORDER BY ItemName ASC
END
GO
/****** Object:  StoredProcedure [dbo].[USP_SearchParty]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_SearchParty
-- =============================================
CREATE   PROCEDURE [dbo].[USP_SearchParty]
    @Keyword NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        PartyName,
        Address,
        City,
        State,
        PinCode,
        GSTIN,
        Mobile,
        Email,
        CreatedDate,
        UpdatedDate,
        IsDeleted
    FROM Party WITH(NOLOCK)
    WHERE IsDeleted = 0 
        AND (PartyName LIKE '%' + @Keyword + '%' 
        OR GSTIN LIKE '%' + @Keyword + '%'
        OR Mobile LIKE '%' + @Keyword + '%')
    ORDER BY PartyName ASC
END
GO
/****** Object:  StoredProcedure [dbo].[USP_SearchUsers]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Search users
-- =============================================
CREATE   PROCEDURE [dbo].[USP_SearchUsers]
    @Keyword VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id, 
        Username,
        Email, 
        FullName, 
        Company, 
        Role,
        IsActive, 
        LastLogin, 
        CreatedAt, 
        UpdatedAt
    FROM Users
    WHERE 
        IsActive = 1 
        AND (
            Username LIKE '%' + @Keyword + '%'
            OR FullName LIKE '%' + @Keyword + '%'
            OR Email LIKE '%' + @Keyword + '%'
            OR Company LIKE '%' + @Keyword + '%'
        )
    ORDER BY FullName;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_UpdateBillingSettings]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:      Your Name
-- Create date: 2024
-- Description: Update Billing Settings
-- =============================================
CREATE PROCEDURE [dbo].[USP_UpdateBillingSettings]
    @Id INT,
    @CompanyName NVARCHAR(200),
    @GSTIN NVARCHAR(50),
    @MobileNumber NVARCHAR(20),
    @Address NVARCHAR(500),
    @City NVARCHAR(100),
    @PinCode NVARCHAR(20),
    @State NVARCHAR(100),
    @Country NVARCHAR(100),
        @UPI varchar(100)
AS
BEGIN
    SET NOCOUNT ON;
    
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
             UPI=@UPI,
        UpdatedDate = GETDATE()
    WHERE Id = @Id;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_UpdateInvoice]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[USP_UpdateInvoice]
    @InvoiceId BIGINT,
    @PaymentStatus int
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE InvoiceMaster
    SET
       PaymentStatus=@PaymentStatus,
        UpdatedDate = GETDATE()
    WHERE Id = @InvoiceId AND IsDeleted = 0;
    
    SELECT @PaymentStatus AS RowsAffected;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_UpdateItemMaster]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_UpdateItemMaster
-- =============================================
CREATE   PROCEDURE [dbo].[USP_UpdateItemMaster]
    @Id INT,
    @ItemName VARCHAR(200),
    @HsnCode VARCHAR(50),
    @Rate DECIMAL(18,2),
    @GST INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if another active item with same name exists
    IF EXISTS (SELECT 1 FROM ItemMaster WHERE ItemName = @ItemName AND Id != @Id AND IsDeleted = 0)
    BEGIN
        SELECT -1 AS RowsAffected; -- Duplicate item name
        RETURN;
    END
    
    UPDATE ItemMaster
    SET
        ItemName = @ItemName,
        HsnCode = @HsnCode,
        Rate = @Rate,
        GST = @GST,
        UpdatedDate = GETDATE()
    WHERE Id = @Id AND IsDeleted = 0;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_UpdateParty]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_UpdateParty
-- =============================================
CREATE   PROCEDURE [dbo].[USP_UpdateParty]
    @Id INT,
    @PartyName NVARCHAR(200),
    @Address NVARCHAR(500),
    @City NVARCHAR(100),
    @State NVARCHAR(100),
    @PinCode NVARCHAR(20),
    @GSTIN varchar(50),
    @Mobile NVARCHAR(20),
    @Email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if another active party with same GSTIN exists
    IF EXISTS (SELECT 1 FROM Party WHERE GSTIN = @GSTIN AND Id != @Id AND IsDeleted = 0)
    BEGIN
        SELECT -1 AS RowsAffected; -- Duplicate GSTIN
        RETURN;
    END
    
    -- Check if another active party with same name exists
    IF EXISTS (SELECT 1 FROM Party WHERE PartyName = @PartyName AND Id != @Id AND IsDeleted = 0)
    BEGIN
        SELECT -2 AS RowsAffected; -- Duplicate Party Name
        RETURN;
    END
    
    UPDATE Party
    SET
        PartyName = @PartyName,
        Address = @Address,
        City = @City,
        State = @State,
        PinCode = @PinCode,
        GSTIN = @GSTIN,
        Mobile = @Mobile,
        Email = @Email,
        UpdatedDate = GETDATE()
    WHERE Id = @Id AND IsDeleted = 0;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_UpdateUser]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Update user
-- =============================================
CREATE   PROCEDURE [dbo].[USP_UpdateUser]
    @Id INT,
    @Username VARCHAR(100),
    @Email VARCHAR(255),
    @FullName VARCHAR(200),
    @Company VARCHAR(255) = NULL,
    @Role VARCHAR(50),
    @IsActive BIT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if email exists for another user
    IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email AND Id != @Id)
    BEGIN
        RETURN -1; -- Email already exists for another user
    END
    
    -- Check if username exists for another user
    IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username AND Id != @Id)
    BEGIN
        RETURN -2; -- Username already exists for another user
    END
    
    UPDATE Users 
    SET 
        Username = @Username,
        Email = @Email,
        FullName = @FullName,
        Company = @Company,
        Role = @Role,
        IsActive = @IsActive,
        UpdatedAt = GETUTCDATE()
    WHERE Id = @Id;
    
    RETURN @Id;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_UpdateUserLastLogin]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Update user last login
-- =============================================
CREATE   PROCEDURE [dbo].[USP_UpdateUserLastLogin]
    @UserId INT,
    @IpAddress VARCHAR(45) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Users 
    SET LastLogin = GETUTCDATE()
    WHERE Id = @UserId;
    
    -- Log login attempt
    DECLARE @Email VARCHAR(255);
    SELECT @Email = Email FROM Users WHERE Id = @UserId;
    
    INSERT INTO LoginAttempts (Email, IpAddress, WasSuccessful)
    VALUES (@Email, @IpAddress, 1);
    
    RETURN @UserId;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_ValidateUserLogin]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Validate user for login (accepts email OR username)
-- =============================================
CREATE   PROCEDURE [dbo].[USP_ValidateUserLogin]
    @EmailOrUsername VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        U.Id AS UserId,
        BS.Id as CompanyId,
        Username,
        Email,
        FullName,
        Company,
        Role,
        PasswordHash,
        IsActive,
        CASE 
            WHEN U.Id IS NULL THEN 'User not found'
            WHEN IsActive = 0 THEN 'Account is deactivated'
            ELSE 'User found'
        END AS Message
    FROM Users U left JOIN BillingSettings BS on U.Id=BS.UserId 
    WHERE Email = @EmailOrUsername OR Username = @EmailOrUsername;
END
GO
