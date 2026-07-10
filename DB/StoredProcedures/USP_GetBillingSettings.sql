USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_GetBillingSettings]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:      Your Name
-- Create date: 2024
-- Description: Get Billing Settings
-- =============================================
CREATE PROCEDURE [dbo].[USP_GetBillingSettings]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP 1 
        Id,
        CompanyName,
        GSTIN as gstin,
        MobileNumber,
        Address,
        City,
        PinCode,
        State,
        Country,
        UPI,
        CreatedDate,
        UpdatedDate
    FROM BillingSettings WITH(NOLOCK)
    ORDER BY Id DESC
END
GO
