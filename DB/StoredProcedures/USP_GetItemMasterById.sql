USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_GetItemMasterById]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_GetItemMasterById
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetItemMasterById]
    @Id INT
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
    WHERE Id = @Id AND IsDeleted = 0
END
GO
