USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_GetRefreshToken]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Validate refresh token
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetRefreshToken]
    @Token VARCHAR(500)
    
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP 1 * FROM RefreshTokens WHERE Token = @Token
END
GO
