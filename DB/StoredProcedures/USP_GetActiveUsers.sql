USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_GetActiveUsers]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Get active users only
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetActiveUsers]
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
    WHERE IsActive = 1
    ORDER BY FullName;
END
GO
