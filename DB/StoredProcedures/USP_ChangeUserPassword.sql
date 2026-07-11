USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_ChangeUserPassword]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_ChangeUserPassword]
    @UserId INT,
    @PasswordHash VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Users
    SET PasswordHash = @PasswordHash,
        UpdatedAt = GETUTCDATE()
    WHERE Id = @UserId;

    IF @@ROWCOUNT = 0
        RETURN -1;

    RETURN @UserId;
END
GO
