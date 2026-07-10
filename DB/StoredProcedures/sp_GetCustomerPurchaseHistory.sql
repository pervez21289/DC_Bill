USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetCustomerPurchaseHistory]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 12. sp_GetCustomerPurchaseHistory - Customer purchase history
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetCustomerPurchaseHistory]
    @CustomerId INT,
    @CompanyId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        i.InvoiceNo,
        i.InvoiceDate,
        i.TotalAmount,
        i.TotalGST,
        i.Status,
        COUNT(iit.Id) AS ItemCount
    FROM Invoices i
    LEFT JOIN InvoiceItems iit ON i.Id = iit.InvoiceId AND iit.IsDeleted = 0
    WHERE i.PartyId = @CustomerId
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
        AND i.IsDeleted = 0
    GROUP BY i.InvoiceNo, i.InvoiceDate, i.TotalAmount, i.TotalGST, i.Status
    ORDER BY i.InvoiceDate DESC;
END
GO
