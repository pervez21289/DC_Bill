USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_DeleteInvoice]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[USP_DeleteInvoice]
    @Id BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Soft delete the invoice
    UPDATE InvoiceMaster
    SET IsDeleted = 1,
        UpdatedDate = GETDATE()
    WHERE Id = @Id;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
