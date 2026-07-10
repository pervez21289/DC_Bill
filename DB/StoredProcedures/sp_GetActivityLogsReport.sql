USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetActivityLogsReport]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[sp_GetActivityLogsReport] --null,2
    @UserId INT = NULL,
    @CompanyId INT = NULL,
    @Action VARCHAR(50) = NULL,
    @Entity VARCHAR(100) = NULL,
    @FromDate DATETIME = NULL,
    @ToDate DATETIME = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @SortColumn VARCHAR(50) = 'CreatedAt',
    @SortDirection VARCHAR(4) = 'DESC'
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Calculate offset
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    -- Build the base query
    ;WITH ActivityLogsCTE AS (
        SELECT 
            Id,
            UserId,
            CompanyId,
            Action,
            Entity,
            EntityId,
            OldValues,
            NewValues,
            RequestBody,
            Parameters,
            IpAddress,
            UserAgent,
            RequestUrl,
            RequestMethod,
            ResponseStatus,
            ExecutionTimeMs,
            CreatedAt,
            -- Get user name if Users table exists
            (SELECT TOP 1 Username FROM Users WHERE Id = ActivityLogs.UserId) AS UserName,
            -- Get company name if Companies table exists
            (SELECT TOP 1 CompanyName FROM [dbo].[BillingSettings] WHERE Id = ActivityLogs.CompanyId) AS CompanyName,
            -- Extract request method for filtering
            RequestMethod AS Method
        FROM ActivityLogs
        WHERE 1=1
            AND (@UserId IS NULL OR UserId = @UserId)
            AND ( CompanyId = @CompanyId)
            AND (@Action IS NULL OR Action LIKE '%' + @Action + '%')
            AND (@Entity IS NULL OR Entity LIKE '%' + @Entity + '%')
            AND (@FromDate IS NULL OR CreatedAt >= @FromDate)
            AND (@ToDate IS NULL OR CreatedAt <= @ToDate)
    )
    -- Get total count for pagination
    SELECT 
        Id,
        UserId,
        UserName,
        CompanyId,
        CompanyName,
        Action,
        Entity,
        EntityId,
        OldValues,
        NewValues,
        RequestBody,
        Parameters,
        IpAddress,
        UserAgent,
        RequestUrl,
        RequestMethod AS Method,
        ResponseStatus,
        ExecutionTimeMs,
        CreatedAt,
        -- Truncate long values for display
        CASE 
            WHEN LEN(OldValues) > 200 THEN LEFT(OldValues, 200) + '...' 
            ELSE OldValues 
        END AS OldValuesShort,
        CASE 
            WHEN LEN(NewValues) > 200 THEN LEFT(NewValues, 200) + '...' 
            ELSE NewValues 
        END AS NewValuesShort,
        COUNT(*) OVER() AS TotalRecords
    FROM ActivityLogsCTE
    ORDER BY 
        CASE WHEN @SortColumn = 'Id' AND @SortDirection = 'ASC' THEN Id END ASC,
        CASE WHEN @SortColumn = 'Id' AND @SortDirection = 'DESC' THEN Id END DESC,
        CASE WHEN @SortColumn = 'UserName' AND @SortDirection = 'ASC' THEN UserName END ASC,
        CASE WHEN @SortColumn = 'UserName' AND @SortDirection = 'DESC' THEN UserName END DESC,
        CASE WHEN @SortColumn = 'Action' AND @SortDirection = 'ASC' THEN Action END ASC,
        CASE WHEN @SortColumn = 'Action' AND @SortDirection = 'DESC' THEN Action END DESC,
        CASE WHEN @SortColumn = 'Entity' AND @SortDirection = 'ASC' THEN Entity END ASC,
        CASE WHEN @SortColumn = 'Entity' AND @SortDirection = 'DESC' THEN Entity END DESC,
        CASE WHEN @SortColumn = 'CreatedAt' AND @SortDirection = 'ASC' THEN CreatedAt END ASC,
        CASE WHEN @SortColumn = 'CreatedAt' AND @SortDirection = 'DESC' THEN CreatedAt END DESC,
        CASE WHEN @SortColumn = 'ResponseStatus' AND @SortDirection = 'ASC' THEN ResponseStatus END ASC,
        CASE WHEN @SortColumn = 'ResponseStatus' AND @SortDirection = 'DESC' THEN ResponseStatus END DESC,
        CASE WHEN @SortColumn = 'ExecutionTimeMs' AND @SortDirection = 'ASC' THEN ExecutionTimeMs END ASC,
        CASE WHEN @SortColumn = 'ExecutionTimeMs' AND @SortDirection = 'DESC' THEN ExecutionTimeMs END DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO
