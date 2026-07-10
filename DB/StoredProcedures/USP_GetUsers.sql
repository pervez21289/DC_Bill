USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_GetUsers]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Get all users
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetUsers]
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
    ORDER BY CreatedAt DESC;
END
GO
