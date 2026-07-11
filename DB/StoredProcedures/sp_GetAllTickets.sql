USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetAllTickets]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetAllTickets]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Id,
        TicketNumber,
        Subject,
        Description,
        Email,
        CompanyId,
        CreatedAt
    FROM Tickets
    ORDER BY CreatedAt DESC;
END
GO
