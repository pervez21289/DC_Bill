USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[sp_UpdateRefreshToken]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_UpdateRefreshToken]
    @OldToken NVARCHAR(MAX),
    @NewToken NVARCHAR(MAX),
    @ExpiryDate DATETIME2,
    @UpdatedAt DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE RefreshTokens 
    SET Token = @NewToken, 
        ExpiryDate = @ExpiryDate, 
        UpdatedAt = @UpdatedAt
    WHERE Token = @OldToken;
    
    -- Optional: Return the number of rows affected
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
