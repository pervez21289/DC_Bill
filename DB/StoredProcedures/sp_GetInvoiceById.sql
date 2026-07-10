USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetInvoiceById]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 6. sp_GetInvoiceById - Get single invoice with details
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetInvoiceById]
    @InvoiceId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id, InvoiceNo, CompanyId, UserId, PartyId,
        PartyName, PartyAddress, PartyCity, PartyPinCode, PartyState, PartyGSTIN,
        InvoiceDate, Subtotal, TotalGST, TotalAmount, GstPercent,
        Status, Notes, CreatedAt, UpdatedAt, IsDeleted
    FROM Invoices
    WHERE Id = @InvoiceId AND IsDeleted = 0;
END
GO
