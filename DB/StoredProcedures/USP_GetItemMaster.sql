USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_GetItemMaster]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- USP_GetItemMaster
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetItemMaster]
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
    ORDER BY ItemName ASC
END
GO
