USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_CheckUsernameExists]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Check if username exists
-- =============================================
CREATE   PROCEDURE [dbo].[USP_CheckUsernameExists]
    @Username VARCHAR(100),
    @ExcludeUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Count INT;
    
    IF @ExcludeUserId IS NULL
    BEGIN
        SELECT @Count = COUNT(1) FROM Users WHERE Username = @Username;
    END
    ELSE
    BEGIN
        SELECT @Count = COUNT(1) FROM Users WHERE Username = @Username AND Id != @ExcludeUserId;
    END
    
    SELECT @Count AS UsernameExists;
END
GO
