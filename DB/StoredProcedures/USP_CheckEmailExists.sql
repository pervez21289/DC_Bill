USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_CheckEmailExists]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Check if email exists
-- =============================================
CREATE   PROCEDURE [dbo].[USP_CheckEmailExists]
    @Email VARCHAR(255),
    @ExcludeUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Count INT;
    
    IF @ExcludeUserId IS NULL
    BEGIN
        SELECT @Count = COUNT(1) FROM Users WHERE Email = @Email;
    END
    ELSE
    BEGIN
        SELECT @Count = COUNT(1) FROM Users WHERE Email = @Email AND Id != @ExcludeUserId;
    END
    
    SELECT @Count AS EmailExists;
END
GO
