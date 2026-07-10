USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_GetPartyByGSTIN]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_GetPartyByGSTIN
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetPartyByGSTIN]
    @GSTIN NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        PartyName,
        Address,
        City,
        State,
        PinCode,
        GSTIN,
        Mobile,
        Email,
        CreatedDate,
        UpdatedDate,
        IsDeleted
    FROM Party WITH(NOLOCK)
    WHERE GSTIN = @GSTIN AND IsDeleted = 0
END
GO
