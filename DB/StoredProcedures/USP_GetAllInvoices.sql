USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[USP_GetAllInvoices]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[USP_GetAllInvoices]
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @Search VARCHAR(100) = NULL,
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @CompanyId int
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT 
        Id, InvoiceNo, InvoiceDate, PartyName, PartyGSTIN, PartyState,
        Subtotal, GSTPercent, TotalGST, GrandTotal, CreatedDate,PaymentStatus,
        COUNT(*) OVER() AS TotalCount
    FROM InvoiceMaster WITH(NOLOCK)
    WHERE IsDeleted = 0 AND CompanyId=@CompanyId
        AND (@Search IS NULL OR 
             InvoiceNo LIKE '%' + @Search + '%' OR
             PartyName LIKE '%' + @Search + '%' OR
             PartyGSTIN LIKE '%' + @Search + '%')
        AND (@StartDate IS NULL OR InvoiceDate >= @StartDate)
        AND (@EndDate IS NULL OR InvoiceDate <= @EndDate)
    ORDER BY Id DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO
