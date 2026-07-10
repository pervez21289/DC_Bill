USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetGSTReport]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Stored Procedure: sp_GetGSTReport
-- Description: Generates GST report with 4 result sets:
--   1. Invoice-wise GST details
--   2. GST Summary (totals)
--   3. HSN-wise summary
--   4. Party-wise GST summary
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetGSTReport]
    @StartDate DATE,
    @EndDate DATE,
    @CompanyId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- =============================================
    -- RESULT SET 1: Invoice-wise GST Details
    -- =============================================
    SELECT 
        i.InvoiceId AS InvoiceId,
        i.InvoiceNumber AS InvoiceNumber,
        i.InvoiceDate AS InvoiceDate,
        i.InvoiceType AS InvoiceType,
        p.PartyName AS PartyName,
        p.GSTIN AS PartyGstin,
        p.StateCode AS PartyStateCode,
        s.StateName AS PartyState,
        i.TaxableAmount AS TaxableAmount,
        i.CGSTAmount AS CGSTAmount,
        i.SGSTAmount AS SGSTAmount,
        i.IGSTAmount AS IGSTAmount,
        (i.CGSTAmount + i.SGSTAmount + i.IGSTAmount) AS TotalGST,
        i.TotalAmount AS TotalAmount,
        i.PaymentStatus AS PaymentStatus,
        i.PlaceOfSupply AS PlaceOfSupply,
        i.ReverseCharge AS ReverseCharge,
        i.EInvoiceStatus AS EInvoiceStatus,
        i.IRN AS IRN,
        i.AckNo AS AckNo,
        i.AckDate AS AckDate
    FROM Invoices i
    INNER JOIN Parties p ON i.PartyId = p.PartyId
    LEFT JOIN States s ON p.StateCode = s.StateCode
    WHERE i.InvoiceDate BETWEEN @StartDate AND @EndDate
        AND i.IsDeleted = 0
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
    ORDER BY i.InvoiceDate DESC, i.InvoiceNumber;

    -- =============================================
    -- RESULT SET 2: GST Summary (Totals)
    -- =============================================
    SELECT 
        COUNT(i.InvoiceId) AS TotalInvoices,
        SUM(i.TaxableAmount) AS TotalTaxableAmount,
        SUM(i.CGSTAmount) AS TotalCGST,
        SUM(i.SGSTAmount) AS TotalSGST,
        SUM(i.IGSTAmount) AS TotalIGST,
        SUM(i.CGSTAmount + i.SGSTAmount + i.IGSTAmount) AS TotalGST,
        SUM(i.TotalAmount) AS GrandTotal,
        SUM(CASE WHEN i.PaymentStatus = 1 THEN 1 ELSE 0 END) AS PaidInvoices,
        SUM(CASE WHEN i.PaymentStatus = 2 THEN 1 ELSE 0 END) AS PartialInvoices,
        SUM(CASE WHEN i.PaymentStatus = 0 THEN 1 ELSE 0 END) AS UnpaidInvoices
    FROM Invoices i
    WHERE i.InvoiceDate BETWEEN @StartDate AND @EndDate
        AND i.IsDeleted = 0
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId);

    -- =============================================
    -- RESULT SET 3: HSN-wise Summary
    -- =============================================
    SELECT 
        id.HSNCode AS HSNCode,
        id.Description AS Description,
        SUM(id.TaxableAmount) AS TaxableAmount,
        SUM(id.CGSTAmount) AS CGSTAmount,
        SUM(id.SGSTAmount) AS SGSTAmount,
        SUM(id.IGSTAmount) AS IGSTAmount,
        SUM(id.CGSTAmount + id.SGSTAmount + id.IGSTAmount) AS TotalGST,
        SUM(id.Quantity) AS TotalQuantity,
        AVG(id.Rate) AS AverageRate,
        COUNT(DISTINCT i.InvoiceId) AS InvoiceCount
    FROM InvoiceDetails id
    INNER JOIN Invoices i ON id.InvoiceId = i.InvoiceId
    WHERE i.InvoiceDate BETWEEN @StartDate AND @EndDate
        AND i.IsDeleted = 0
        AND id.IsDeleted = 0
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
    GROUP BY id.HSNCode, id.Description
    ORDER BY TotalGST DESC;

    -- =============================================
    -- RESULT SET 4: Party-wise GST Summary
    -- =============================================
    SELECT 
        p.PartyId AS PartyId,
        p.PartyName AS PartyName,
        p.GSTIN AS PartyGstin,
        p.StateCode AS PartyStateCode,
        s.StateName AS PartyState,
        COUNT(i.InvoiceId) AS InvoiceCount,
        SUM(i.TaxableAmount) AS TaxableAmount,
        SUM(i.CGSTAmount) AS CGSTAmount,
        SUM(i.SGSTAmount) AS SGSTAmount,
        SUM(i.IGSTAmount) AS IGSTAmount,
        SUM(i.CGSTAmount + i.SGSTAmount + i.IGSTAmount) AS TotalGST,
        SUM(i.TotalAmount) AS TotalAmount,
        SUM(CASE WHEN i.PaymentStatus = 1 THEN i.TotalAmount ELSE 0 END) AS PaidAmount,
        SUM(CASE WHEN i.PaymentStatus = 2 THEN i.TotalAmount ELSE 0 END) AS PartialAmount,
        SUM(CASE WHEN i.PaymentStatus = 0 THEN i.TotalAmount ELSE 0 END) AS UnpaidAmount
    FROM Invoices i
    INNER JOIN Parties p ON i.PartyId = p.PartyId
    LEFT JOIN States s ON p.StateCode = s.StateCode
    WHERE i.InvoiceDate BETWEEN @StartDate AND @EndDate
        AND i.IsDeleted = 0
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
    GROUP BY p.PartyId, p.PartyName, p.GSTIN, p.StateCode, s.StateName
    ORDER BY TotalGST DESC;

END
GO
