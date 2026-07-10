USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_CreateBillingSettings]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:      Your Name
-- Create date: 2024
-- Description: Create or Update Billing Settings based on Company Name
-- =============================================
CREATE PROCEDURE [dbo].[USP_CreateBillingSettings]
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
    
    DECLARE @ExistingId INT;
    
    -- Check if record with same CompanyName exists
    SELECT @ExistingId = Id 
    FROM BillingSettings WITH(NOLOCK)
    WHERE CompanyName = @CompanyName;
    
    -- If exists, update the record
    IF @ExistingId IS NOT NULL
    BEGIN
        UPDATE BillingSettings
        SET
            GSTIN = @GSTIN,
            MobileNumber = @MobileNumber,
            Address = @Address,
            City = @City,
            PinCode = @PinCode,
            State = @State,
            Country = @Country,
            UPI=@UPI,
            UpdatedDate = GETDATE()
        WHERE Id = @ExistingId;
        
        -- Return the existing Id
        SELECT @ExistingId AS Id;
    END
    -- If not exists, insert new record
    ELSE
    BEGIN
        INSERT INTO BillingSettings
        (
            CompanyName,
            GSTIN,
            MobileNumber,
            Address,
            City,
            PinCode,
            State,
            Country,
            UPI,
            CreatedDate
        )
        VALUES
        (
            @CompanyName,
            @GSTIN,
            @MobileNumber,
            @Address,
            @City,
            @PinCode,
            @State,
            @Country,
            @UPI,
            GETDATE()
        );
        
        -- Return the new Id
        SELECT CAST(SCOPE_IDENTITY() AS INT) AS Id;
    END
END
GO
