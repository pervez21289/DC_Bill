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
        i.Id AS InvoiceId,
        i.InvoiceNo AS InvoiceNumber,
        i.InvoiceDate AS InvoiceDate,
        CASE WHEN ISNULL(p.GSTIN, '') = '' THEN 'B2C' ELSE 'B2B' END AS InvoiceType,
        ISNULL(p.PartyName, i.PartyName) AS PartyName,
        ISNULL(p.GSTIN, i.PartyGSTIN) AS PartyGstin,
        ISNULL(p.State, i.PartyState) AS PartyStateCode,
        ISNULL(p.State, i.PartyState) AS PartyState,
        i.Subtotal AS TaxableAmount,
        COALESCE(i.TotalGST, 0) / 2 AS CGSTAmount,
        COALESCE(i.TotalGST, 0) / 2 AS SGSTAmount,
        0 AS IGSTAmount,
        i.TotalGST AS TotalGST,
        i.GrandTotal AS TotalAmount,
        i.PaymentStatus AS PaymentStatus,
        i.PartyState AS PlaceOfSupply,
        0 AS ReverseCharge,
        '' AS EInvoiceStatus,
        '' AS IRN,
        '' AS AckNo,
        NULL AS AckDate
    FROM InvoiceMaster i
    LEFT JOIN Party p ON i.PartyId = p.Id
    WHERE i.InvoiceDate BETWEEN @StartDate AND @EndDate
        AND i.IsDeleted = 0
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
    ORDER BY i.InvoiceDate DESC, i.InvoiceNo;

    -- =============================================
    -- RESULT SET 2: GST Summary (Totals)
    -- =============================================
    SELECT
        COUNT(i.Id) AS TotalInvoices,
        SUM(i.Subtotal) AS TotalTaxableAmount,
        SUM(COALESCE(i.TotalGST, 0) / 2) AS TotalCGST,
        SUM(COALESCE(i.TotalGST, 0) / 2) AS TotalSGST,
        0 AS TotalIGST,
        SUM(COALESCE(i.TotalGST, 0)) AS TotalGST,
        SUM(COALESCE(i.GrandTotal, 0)) AS GrandTotal,
        SUM(CASE WHEN i.PaymentStatus = 1 THEN 1 ELSE 0 END) AS PaidInvoices,
        SUM(CASE WHEN i.PaymentStatus = 2 THEN 1 ELSE 0 END) AS PartialInvoices,
        SUM(CASE WHEN i.PaymentStatus = 0 THEN 1 ELSE 0 END) AS UnpaidInvoices
    FROM InvoiceMaster i
    WHERE i.InvoiceDate BETWEEN @StartDate AND @EndDate
        AND i.IsDeleted = 0
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId);

    -- =============================================
    -- RESULT SET 3: HSN-wise Summary
    -- =============================================
    SELECT
        id.HsnCode AS HSNCode,
        id.ItemName AS Description,
        SUM(id.Amount) AS TaxableAmount,
        SUM(ISNULL(id.GSTAmount, 0) / 2) AS CGSTAmount,
        SUM(ISNULL(id.GSTAmount, 0) / 2) AS SGSTAmount,
        0 AS IGSTAmount,
        SUM(ISNULL(id.GSTAmount, 0)) AS TotalGST,
        SUM(id.Quantity) AS TotalQuantity,
        AVG(id.Rate) AS AverageRate,
        COUNT(DISTINCT id.InvoiceId) AS InvoiceCount
    FROM InvoiceDetails id
    INNER JOIN InvoiceMaster i ON id.InvoiceId = i.Id
    WHERE i.InvoiceDate BETWEEN @StartDate AND @EndDate
        AND i.IsDeleted = 0
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
    GROUP BY id.HsnCode, id.ItemName
    ORDER BY TotalGST DESC;

    -- =============================================
    -- RESULT SET 4: Party-wise GST Summary
    -- =============================================
    SELECT
        ISNULL(p.Id, 0) AS PartyId,
        ISNULL(p.PartyName, i.PartyName) AS PartyName,
        ISNULL(p.GSTIN, i.PartyGSTIN) AS PartyGstin,
        ISNULL(p.State, i.PartyState) AS PartyStateCode,
        ISNULL(p.State, i.PartyState) AS PartyState,
        COUNT(i.Id) AS InvoiceCount,
        SUM(i.Subtotal) AS TaxableAmount,
        SUM(COALESCE(i.TotalGST, 0) / 2) AS CGSTAmount,
        SUM(COALESCE(i.TotalGST, 0) / 2) AS SGSTAmount,
        0 AS IGSTAmount,
        SUM(COALESCE(i.TotalGST, 0)) AS TotalGST,
        SUM(COALESCE(i.GrandTotal, 0)) AS TotalAmount,
        SUM(CASE WHEN i.PaymentStatus = 1 THEN COALESCE(i.GrandTotal, 0) ELSE 0 END) AS PaidAmount,
        SUM(CASE WHEN i.PaymentStatus = 2 THEN COALESCE(i.GrandTotal, 0) ELSE 0 END) AS PartialAmount,
        SUM(CASE WHEN i.PaymentStatus = 0 THEN COALESCE(i.GrandTotal, 0) ELSE 0 END) AS UnpaidAmount
    FROM InvoiceMaster i
    LEFT JOIN Party p ON i.PartyId = p.Id
    WHERE i.InvoiceDate BETWEEN @StartDate AND @EndDate
        AND i.IsDeleted = 0
        AND (@CompanyId IS NULL OR i.CompanyId = @CompanyId)
    GROUP BY ISNULL(p.Id, 0), ISNULL(p.PartyName, i.PartyName), ISNULL(p.GSTIN, i.PartyGSTIN), ISNULL(p.State, i.PartyState)
    ORDER BY TotalGST DESC;
END