USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_GetUserByUsername]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Get user by username
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetUserByUsername]
    @Username VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        Id, 
        Username,
        Email, 
        FullName, 
        Company, 
        Role,
        IsActive, 
        LastLogin, 
        CreatedAt, 
        UpdatedAt
    FROM Users
    WHERE Username = @Username;
END
GO
