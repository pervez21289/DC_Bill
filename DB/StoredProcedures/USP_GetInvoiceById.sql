USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_GetInvoiceById]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[USP_GetInvoiceById]
    @Id BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get Invoice Master with GST split calculated based only on GSTPercent
    SELECT 
        Id, 
        InvoiceNo, 
        InvoiceDate, 
        PartyId, 
        PartyName,
        PartyAddress, 
        PartyCity, 
        PartyState, 
        PartyPinCode, 
        PartyGSTIN,
        Subtotal, 
        GSTPercent, 
        TotalGST, 
        GrandTotal, 
        Notes, 
        CreatedDate,
        -- Calculate CGST, SGST, IGST based solely on GSTPercent
        -- Assuming all transactions are intra-state (CGST + SGST)
        GSTPercent / 2 AS CGSTPercent,
        GSTPercent / 2 AS SGSTPercent,
        0 AS IGSTPercent,
        -- Calculate individual tax amounts
        TotalGST / 2 AS CGSTAmount,
        TotalGST / 2 AS SGSTAmount,
        0 AS IGSTAmount,
        PaymentStatus
    FROM InvoiceMaster WITH(NOLOCK)
    WHERE Id = @Id AND IsDeleted = 0;
    
    -- Get Invoice Details
    SELECT 
        Id, 
        InvoiceId, 
        ItemId, 
        ItemName, 
        HsnCode,
        Quantity, 
        Rate, 
        Amount, 
        CreatedDate
    FROM InvoiceDetails WITH(NOLOCK)
    WHERE InvoiceId = @Id
    ORDER BY Id ASC;
END
GO
