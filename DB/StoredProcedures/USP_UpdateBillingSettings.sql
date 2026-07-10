USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_UpdateBillingSettings]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:      Your Name
-- Create date: 2024
-- Description: Update Billing Settings
-- =============================================
CREATE PROCEDURE [dbo].[USP_UpdateBillingSettings]
    @Id INT,
    @CompanyName NVARCHAR(200),
    @GSTIN NVARCHAR(50),
    @MobileNumber NVARCHAR(20),
    @Address NVARCHAR(500),
    @City NVARCHAR(100),
    @PinCode NVARCHAR(20),
    @State NVARCHAR(100),
    @Country NVARCHAR(100),
        @UPI varchar(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE BillingSettings
    SET
        CompanyName = @CompanyName,
        GSTIN = @GSTIN,
        MobileNumber = @MobileNumber,
        Address = @Address,
        City = @City,
        PinCode = @PinCode,
        State = @State,
        Country = @Country,
             UPI=@UPI,
        UpdatedDate = GETDATE()
    WHERE Id = @Id;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
