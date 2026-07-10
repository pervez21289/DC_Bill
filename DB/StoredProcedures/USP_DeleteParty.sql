USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_DeleteParty]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_DeleteParty (Soft Delete)
-- =============================================
CREATE   PROCEDURE [dbo].[USP_DeleteParty]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Party
    SET IsDeleted = 1,
        UpdatedDate = GETDATE()
    WHERE Id = @Id;
    
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
