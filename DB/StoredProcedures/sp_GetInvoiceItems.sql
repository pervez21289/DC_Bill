USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetInvoiceItems]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 7. sp_GetInvoiceItems - Get invoice items
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetInvoiceItems]
    @InvoiceId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id, InvoiceId, ProductId, ItemName, HsnCode,
        Quantity, Rate, Amount, Discount, Tax, IsDeleted
    FROM InvoiceItems
    WHERE InvoiceId = @InvoiceId AND IsDeleted = 0
    ORDER BY Id;
END
GO
