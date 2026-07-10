USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_SearchItemMaster]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_SearchItemMaster
-- =============================================
CREATE   PROCEDURE [dbo].[USP_SearchItemMaster]
    @Keyword NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        ItemName,
        HsnCode,
        Rate,
        GST,
        CreatedDate,
        UpdatedDate,
        IsDeleted
    FROM ItemMaster WITH(NOLOCK)
    WHERE IsDeleted = 0 
        AND (ItemName LIKE '%' + @Keyword + '%' 
        OR HsnCode LIKE '%' + @Keyword + '%')
    ORDER BY ItemName ASC
END
GO
