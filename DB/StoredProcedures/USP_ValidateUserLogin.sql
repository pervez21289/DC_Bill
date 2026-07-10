USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_ValidateUserLogin]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Validate user for login (accepts email OR username)
-- =============================================
CREATE   PROCEDURE [dbo].[USP_ValidateUserLogin]
    @EmailOrUsername VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        U.Id AS UserId,
        BS.Id as CompanyId,
        Username,
        Email,
        FullName,
        Company,
        Role,
        PasswordHash,
        IsActive,
        CASE 
            WHEN U.Id IS NULL THEN 'User not found'
            WHEN IsActive = 0 THEN 'Account is deactivated'
            ELSE 'User found'
        END AS Message
    FROM Users U left JOIN BillingSettings BS on U.Id=BS.UserId 
    WHERE Email = @EmailOrUsername OR Username = @EmailOrUsername;
END
GO
