USE [DCBill_Dev]
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
