USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_UpdateParty]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_UpdateParty
-- =============================================
CREATE   PROCEDURE [dbo].[USP_UpdateParty]
    @Id INT,
    @PartyName NVARCHAR(200),
    @Address NVARCHAR(500),
    @City NVARCHAR(100),
    @State NVARCHAR(100),
    @PinCode NVARCHAR(20),
    @GSTIN varchar(50),
    @Mobile NVARCHAR(20),
    @Email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if another active party with same GSTIN exists
    IF EXISTS (SELECT 1 FROM Party WHERE GSTIN = @GSTIN AND Id != @Id AND IsDeleted = 0)
    BEGIN
        SELECT -1 AS RowsAffected; -- Duplicate GSTIN
        RETURN;
    END
    
    -- Check if another active party with same name exists
    IF EXISTS (SELECT 1 FROM Party WHERE PartyName = @PartyName AND Id != @Id AND IsDeleted = 0)
    BEGIN
        SELECT -2 AS RowsAffected; -- Duplicate Party Name
        RETURN;
    END
    
    UPDATE Party
    SET
        PartyName = @PartyName,
        Address = @Address,
        City = @City,
        State = @State,
        PinCode = @PinCode,
        GSTIN = @GSTIN,
        Mobile = @Mobile,
        Email = @Email,
        UpdatedDate = GETDATE()
    WHERE Id = @Id AND IsDeleted = 0;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
