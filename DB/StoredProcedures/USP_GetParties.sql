USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_GetParties]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- USP_GetParties
-- =============================================
CREATE   PROCEDURE [dbo].[USP_GetParties]
(
@CompanyId int
)
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
    WHERE CompanyId= @CompanyId and IsDeleted = 0
    ORDER BY PartyName ASC
END
GO
