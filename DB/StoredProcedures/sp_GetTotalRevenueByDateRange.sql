USE [DCBill_Dev]
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
