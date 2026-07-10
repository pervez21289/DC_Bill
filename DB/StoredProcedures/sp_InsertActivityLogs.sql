USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[sp_InsertActivityLogs]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Create stored procedure for batch insert
CREATE PROCEDURE [dbo].[sp_InsertActivityLogs]
    @Logs dbo.ActivityLogType READONLY
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO ActivityLogs 
    (UserId, CompanyId, Action, Entity, EntityId,  OldValues, NewValues, 
     RequestBody, Parameters, IpAddress, UserAgent, RequestUrl, RequestMethod, 
     ResponseStatus, ExecutionTimeMs, CreatedAt)
    SELECT 
        UserId, CompanyId, Action, Entity, EntityId,  OldValues, NewValues,
        RequestBody, Parameters, IpAddress, UserAgent, RequestUrl, RequestMethod,
        ResponseStatus, ExecutionTimeMs, CreatedAt
    FROM @Logs;
    
    -- Return count of inserted records (optional)
    SELECT @@ROWCOUNT AS InsertedCount;
END
GO
