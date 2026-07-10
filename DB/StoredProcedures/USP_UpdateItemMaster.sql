USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_UpdateItemMaster]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_UpdateItemMaster
-- =============================================
CREATE   PROCEDURE [dbo].[USP_UpdateItemMaster]
    @Id INT,
    @ItemName VARCHAR(200),
    @HsnCode VARCHAR(50),
    @Rate DECIMAL(18,2),
    @GST INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if another active item with same name exists
    IF EXISTS (SELECT 1 FROM ItemMaster WHERE ItemName = @ItemName AND Id != @Id AND IsDeleted = 0)
    BEGIN
        SELECT -1 AS RowsAffected; -- Duplicate item name
        RETURN;
    END
    
    UPDATE ItemMaster
    SET
        ItemName = @ItemName,
        HsnCode = @HsnCode,
        Rate = @Rate,
        GST = @GST,
        UpdatedDate = GETDATE()
    WHERE Id = @Id AND IsDeleted = 0;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
