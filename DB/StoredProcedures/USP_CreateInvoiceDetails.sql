USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_CreateInvoiceDetails]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[USP_CreateInvoiceDetails]
    @InvoiceId BIGINT,
    @ItemId BIGINT,
    @ItemName VARCHAR(200),
    @HsnCode VARCHAR(50),
    @Quantity DECIMAL(18,2),
    @Rate DECIMAL(18,2),
    @Amount DECIMAL(18,2),
    @GSTPercent INT,
    @GSTAmount DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO InvoiceDetails
    (
        InvoiceId, ItemId, ItemName, HsnCode, Quantity,
        Rate, Amount, GSTPercent, GSTAmount, CGSTAmount, SGSTAmount, IGSTAmount, CreatedDate
    )
    VALUES
    (
        @InvoiceId, @ItemId, @ItemName, @HsnCode, @Quantity,
        @Rate, @Amount, @GSTPercent, @GSTAmount, (@GSTAmount / 2), (@GSTAmount / 2), 0, GETDATE()
    );
    
    SELECT CAST(SCOPE_IDENTITY() AS BIGINT) AS Id;
END
GO
