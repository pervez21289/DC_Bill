USE [DCBill_Dev]
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
