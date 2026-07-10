USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_CreateInvoice]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[USP_CreateInvoice]
    @InvoiceNo VARCHAR(50),
    @InvoiceDate DATE,
    @PartyId BIGINT,
    @PartyName VARCHAR(200),
    @PartyAddress VARCHAR(500) = NULL,
    @PartyCity VARCHAR(100) = NULL,
    @PartyState VARCHAR(100) = NULL,
    @PartyPinCode VARCHAR(20) = NULL,
    @PartyGSTIN VARCHAR(50) = NULL,
    @Subtotal DECIMAL(18,2),
    @GSTPercent DECIMAL(5,2),
    @Notes VARCHAR(500) = NULL,
    @CompanyId int,
    @PaymentStatus tinyint
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @InvoiceId BIGINT;
    DECLARE @TotalGST DECIMAL(18,2);
    DECLARE @GrandTotal DECIMAL(18,2);
    
    -- Calculate totals
    SET @TotalGST = (@Subtotal * @GSTPercent) / 100;
    SET @GrandTotal = @Subtotal + @TotalGST;
    
    INSERT INTO InvoiceMaster
    (
        InvoiceNo, InvoiceDate, PartyId, PartyName, PartyAddress,
        PartyCity, PartyState, PartyPinCode, PartyGSTIN,
        Subtotal, GSTPercent, TotalGST, GrandTotal, Notes, CreatedDate,CompanyId,PaymentStatus
    )
    VALUES
    (
        @InvoiceNo, @InvoiceDate, @PartyId, @PartyName, @PartyAddress,
        @PartyCity, @PartyState, @PartyPinCode, @PartyGSTIN,
        @Subtotal, @GSTPercent, @TotalGST, @GrandTotal, @Notes, GETDATE(),@CompanyId,@PaymentStatus
    );
    
    SET @InvoiceId = SCOPE_IDENTITY();
    SELECT @InvoiceId AS Id;
END
GO
