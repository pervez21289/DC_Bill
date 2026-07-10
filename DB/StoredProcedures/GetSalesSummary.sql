USE [DCBill_Dev]
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
