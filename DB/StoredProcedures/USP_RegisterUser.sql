USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_RegisterUser]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Register user (with output parameters)
-- =============================================
CREATE   PROCEDURE [dbo].[USP_RegisterUser]
    @Username VARCHAR(100),
    @Email VARCHAR(255),
    @PasswordHash VARCHAR(255),
    @FullName VARCHAR(200),
    @Company VARCHAR(255) = NULL,
    @Role VARCHAR(50) = 'User'
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @UserId INT;
    DECLARE @Message VARCHAR(255);
    
    BEGIN TRY
        -- Check if email already exists
        IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
        BEGIN
            SELECT 
                NULL AS UserId, 
                'Email already registered' AS Message;
            RETURN;
        END
        
        -- Check if username already exists
        IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username)
        BEGIN
            SELECT 
                NULL AS UserId, 
                'Username already taken' AS Message;
            RETURN;
        END
        
        -- Insert new user
        INSERT INTO Users (Username, Email, PasswordHash, FullName, Company, Role, IsActive)
        VALUES (@Username, @Email, @PasswordHash, @FullName, @Company, @Role, 1);


        SET @UserId = SCOPE_IDENTITY();

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
        
        
        SET @Message = 'Registration successful';
        
        SELECT @UserId AS UserId, @Message AS Message;
    END TRY
    BEGIN CATCH
        SELECT 
            NULL AS UserId, 
            ERROR_MESSAGE() AS Message;
    END CATCH
END
GO
