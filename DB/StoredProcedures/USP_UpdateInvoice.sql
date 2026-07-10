USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_UpdateInvoice]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[USP_UpdateInvoice]
    @InvoiceId BIGINT,
    @PaymentStatus int
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE InvoiceMaster
    SET
       PaymentStatus=@PaymentStatus,
        UpdatedDate = GETDATE()
    WHERE Id = @InvoiceId AND IsDeleted = 0;
    
    SELECT @PaymentStatus AS RowsAffected;
END
GO
