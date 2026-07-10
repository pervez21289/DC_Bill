USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_CreateUser]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Create user
-- =============================================
CREATE   PROCEDURE [dbo].[USP_CreateUser]
    @Username VARCHAR(100),
    @Email VARCHAR(255),
    @PasswordHash VARCHAR(255),
    @FullName VARCHAR(200),
    @Company VARCHAR(255) = NULL,
    @Role VARCHAR(50) = 'User'
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
    BEGIN
        RETURN -1; -- Email already exists
    END
    
    IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username)
    BEGIN
        RETURN -2; -- Username already exists
    END
    
    INSERT INTO Users (Username, Email, PasswordHash, FullName, Company, Role, IsActive)
    VALUES (@Username, @Email, @PasswordHash, @FullName, @Company, @Role, 1);

    DECLARE @UserId INT = SCOPE_IDENTITY();

     INSERT INTO BillingSettings
        (
            CompanyName,
            CreatedDate,
            UserId
        )
        VALUES
        (
            @Company,
            GETDATE(),
            @UserId
        );
    
    RETURN @UserId;
END
GO
