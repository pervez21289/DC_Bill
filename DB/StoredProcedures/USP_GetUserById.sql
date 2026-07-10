USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_GetUserById]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Get user by ID
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetUserById]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        U.Id, 
        Username,
        Email, 
        FullName, 
        Company, 
        Role,
        IsActive, 
        LastLogin, 
        CreatedAt, 
        UpdatedAt,
        bs.Id as CompanyId
    FROM Users U join [dbo].[BillingSettings] bs on U.Id=bs.UserId
    WHERE U.Id = @Id;
END
GO
