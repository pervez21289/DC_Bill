USE [DCBill_Dev]
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
