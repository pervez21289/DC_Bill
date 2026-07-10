USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetDateRange]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 2. sp_GetDateRange - Get calculated date range based on filter
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetDateRange]
    @FilterType NVARCHAR(20) = 'today',
    @StartDate DATE = NULL,
    @EndDate DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @CalculatedStartDate DATE, @CalculatedEndDate DATE;
    
    IF @StartDate IS NOT NULL AND @EndDate IS NOT NULL
    BEGIN
        SET @CalculatedStartDate = @StartDate;
        SET @CalculatedEndDate = @EndDate;
    END
    ELSE
    BEGIN
        SET @CalculatedEndDate = CAST(GETDATE() AS DATE);
        
        IF @FilterType = 'today'
            SET @CalculatedStartDate = CAST(GETDATE() AS DATE);
        ELSE IF @FilterType = 'week'
            SET @CalculatedStartDate = DATEADD(DAY, -7, GETDATE());
        ELSE IF @FilterType = 'month'
            SET @CalculatedStartDate = DATEADD(MONTH, -1, GETDATE());
        ELSE IF @FilterType = 'year'
            SET @CalculatedStartDate = DATEADD(YEAR, -1, GETDATE());
        ELSE
            SET @CalculatedStartDate = DATEADD(DAY, -30, GETDATE());
    END
    
    SELECT @CalculatedStartDate AS StartDate, @CalculatedEndDate AS EndDate;
END
GO
