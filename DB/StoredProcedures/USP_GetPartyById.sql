USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_GetPartyById]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_GetPartyById
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetPartyById]
    @Id INT
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
    WHERE Id = @Id AND IsDeleted = 0
END
GO
