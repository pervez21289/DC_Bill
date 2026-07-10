USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_UpdateUserLastLogin]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Update user last login
-- =============================================
CREATE   PROCEDURE [dbo].[USP_UpdateUserLastLogin]
    @UserId INT,
    @IpAddress VARCHAR(45) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Users 
    SET LastLogin = GETUTCDATE()
    WHERE Id = @UserId;
    
    -- Log login attempt
    DECLARE @Email VARCHAR(255);
    SELECT @Email = Email FROM Users WHERE Id = @UserId;
    
    INSERT INTO LoginAttempts (Email, IpAddress, WasSuccessful)
    VALUES (@Email, @IpAddress, 1);
    
    RETURN @UserId;
END
GO
