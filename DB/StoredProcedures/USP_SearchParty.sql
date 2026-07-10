USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_SearchParty]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_SearchParty
-- =============================================
CREATE   PROCEDURE [dbo].[USP_SearchParty]
    @Keyword NVARCHAR(100)
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
    WHERE IsDeleted = 0 
        AND (PartyName LIKE '%' + @Keyword + '%' 
        OR GSTIN LIKE '%' + @Keyword + '%'
        OR Mobile LIKE '%' + @Keyword + '%')
    ORDER BY PartyName ASC
END
GO
