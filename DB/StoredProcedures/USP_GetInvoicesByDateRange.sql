USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_GetInvoicesByDateRange]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[USP_GetInvoicesByDateRange]
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id, InvoiceNo, InvoiceDate, PartyName,
        Subtotal, TotalGST, GrandTotal, CreatedDate
    FROM InvoiceMaster WITH(NOLOCK)
    WHERE IsDeleted = 0 
        AND InvoiceDate BETWEEN @StartDate AND @EndDate
    ORDER BY InvoiceDate DESC, Id DESC;
END
GO
