USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_GetUserCount]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Get user count
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetUserCount]
    @IsActive BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Count INT;
    
    IF @IsActive IS NULL
    BEGIN
        SELECT @Count = COUNT(1) FROM Users;
    END
    ELSE
    BEGIN
        SELECT @Count = COUNT(1) FROM Users WHERE IsActive = @IsActive;
    END
    
    SELECT @Count AS UserCount;
END
GO
