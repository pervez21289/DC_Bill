USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_GetUserByEmail]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Get user by email
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetUserByEmail]
    @Email VARCHAR(255)
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
    WHERE Email = @Email;
END
GO
