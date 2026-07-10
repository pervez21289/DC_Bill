USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_CreateParty]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_CreateParty
-- =============================================
CREATE   PROCEDURE [dbo].[USP_CreateParty]
    @PartyName NVARCHAR(200),
    @Address NVARCHAR(500),
    @City NVARCHAR(100),
    @State NVARCHAR(100),
    @PinCode NVARCHAR(20),
    @GSTIN NVARCHAR(50),
    @Mobile NVARCHAR(20),
    @Email NVARCHAR(100),
    @CompanyId int 
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if active party with same GSTIN already exists
    IF EXISTS (SELECT 1 FROM Party WHERE GSTIN = @GSTIN AND IsDeleted = 0)
    BEGIN
        SELECT -1 AS Id; -- Duplicate GSTIN
        RETURN;
    END
    
    -- Check if active party with same name already exists
    IF EXISTS (SELECT 1 FROM Party WHERE PartyName = @PartyName AND IsDeleted = 0)
    BEGIN
        SELECT -2 AS Id; -- Duplicate Party Name
        RETURN;
    END
    
    INSERT INTO Party
    (
        PartyName,
        Address,
        City,
        State,
        PinCode,
        GSTIN,
        Mobile,
        Email,
        CreatedDate,
        IsDeleted,
        CompanyId
    )
    VALUES
    (
        @PartyName,
        @Address,
        @City,
        @State,
        @PinCode,
        @GSTIN,
        @Mobile,
        @Email,
        GETDATE(),
        0,
        @CompanyId
    );
    
    SELECT CAST(SCOPE_IDENTITY() AS INT) AS Id;
END
GO
