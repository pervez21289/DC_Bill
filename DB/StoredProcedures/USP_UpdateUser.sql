USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_UpdateUser]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Update user
-- =============================================
CREATE   PROCEDURE [dbo].[USP_UpdateUser]
    @Id INT,
    @Username VARCHAR(100),
    @Email VARCHAR(255),
    @FullName VARCHAR(200),
    @Company VARCHAR(255) = NULL,
    @Role VARCHAR(50),
    @IsActive BIT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if email exists for another user
    IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email AND Id != @Id)
    BEGIN
        RETURN -1; -- Email already exists for another user
    END
    
    -- Check if username exists for another user
    IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username AND Id != @Id)
    BEGIN
        RETURN -2; -- Username already exists for another user
    END
    
    UPDATE Users 
    SET 
        Username = @Username,
        Email = @Email,
        FullName = @FullName,
        Company = @Company,
        Role = @Role,
        IsActive = @IsActive,
        UpdatedAt = GETUTCDATE()
    WHERE Id = @Id;
    
    RETURN @Id;
END
GO
