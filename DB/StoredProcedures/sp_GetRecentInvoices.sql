USE [DCBill_Dev]
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
