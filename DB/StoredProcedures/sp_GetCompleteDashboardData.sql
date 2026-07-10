USE [DCBill_Dev]
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
