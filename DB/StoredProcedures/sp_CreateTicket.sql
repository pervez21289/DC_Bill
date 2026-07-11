USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[sp_CreateTicket]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_CreateTicket]
    @Subject NVARCHAR(200),
    @Description NVARCHAR(MAX),
    @Email VARCHAR(255),
    @CompanyId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Tickets (Subject, Description, Email, CompanyId, CreatedAt)
    VALUES (@Subject, @Description, @Email, @CompanyId, GETUTCDATE());

    DECLARE @Id INT = SCOPE_IDENTITY();
    DECLARE @TicketNumber VARCHAR(50) = 'TKT' + RIGHT('00000' + CAST(@Id AS VARCHAR(5)), 5);

    UPDATE Tickets
    SET TicketNumber = @TicketNumber
    WHERE Id = @Id;

    SELECT @Id AS Id, @TicketNumber AS TicketNumber;
END
GO
