USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_CreateItemMaster]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_CreateItemMaster
-- =============================================
CREATE   PROCEDURE [dbo].[USP_CreateItemMaster]
    @ItemName NVARCHAR(200),
    @HsnCode NVARCHAR(50),
    @Rate DECIMAL(18,2),
    @GST INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if active item with same name already exists
    IF EXISTS (SELECT 1 FROM ItemMaster WHERE ItemName = @ItemName AND IsDeleted = 0)
    BEGIN
        SELECT -1 AS Id; -- Duplicate item name
        RETURN;
    END
    
    INSERT INTO ItemMaster
    (
        ItemName,
        HsnCode,
        Rate,
        GST,
        CreatedDate,
        IsDeleted
    )
    VALUES
    (
        @ItemName,
        @HsnCode,
        @Rate,
        @GST,
        GETDATE(),
        0
    );
    
    SELECT CAST(SCOPE_IDENTITY() AS INT) AS Id;
END
GO
