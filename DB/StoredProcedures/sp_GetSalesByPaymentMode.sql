USE [DCBill_Dev]
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
