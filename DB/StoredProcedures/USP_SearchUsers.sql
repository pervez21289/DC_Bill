USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_SearchUsers]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Search users
-- =============================================
CREATE   PROCEDURE [dbo].[USP_SearchUsers]
    @Keyword VARCHAR(255)
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
    WHERE 
        IsActive = 1 
        AND (
            Username LIKE '%' + @Keyword + '%'
            OR FullName LIKE '%' + @Keyword + '%'
            OR Email LIKE '%' + @Keyword + '%'
            OR Company LIKE '%' + @Keyword + '%'
        )
    ORDER BY FullName;
END
GO
