USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetCompanyDetails]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetCompanyDetails]
    @CompanyId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        CompanyName,
        GSTIN,
        State AS CompanyState,
        Address AS CompanyAddress,
        City AS CompanyCity,
        PinCode AS CompanyPinCode,
        Country AS CompanyCountry,
        MobileNumber AS CompanyPhone,
        UPI AS CompanyUPI,
        '' AS CompanyPAN,
        '' AS CompanyStateCode
    FROM BillingSettings
    ORDER BY Id;
END
GO
