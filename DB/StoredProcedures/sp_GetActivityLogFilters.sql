USE [DCBill_Dev]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetActivityLogFilters]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Get filter options for dropdowns
CREATE   PROCEDURE [dbo].[sp_GetActivityLogFilters]
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get distinct actions
    SELECT DISTINCT Action AS Value, Action AS Label 
    FROM ActivityLogs 
    WHERE Action IS NOT NULL 
    ORDER BY Action;
    
    -- Get distinct entities
    SELECT DISTINCT Entity AS Value, Entity AS Label 
    FROM ActivityLogs 
    WHERE Entity IS NOT NULL 
    ORDER BY Entity;
    
    -- Get distinct users (if Users table exists)
    -- SELECT DISTINCT UserId, Username FROM Users WHERE IsActive = 1 ORDER BY Username;
END
GO
