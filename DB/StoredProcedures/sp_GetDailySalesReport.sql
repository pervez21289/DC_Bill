USE [DCBill_Dev]
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
