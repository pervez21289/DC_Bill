USE [DCBill_Dev]
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
