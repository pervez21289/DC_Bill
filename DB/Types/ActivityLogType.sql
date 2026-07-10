USE [DCBill_Dev]
GO

/****** Object:  UserDefinedTableType [dbo].[ActivityLogType]    Script Date: 10-07-2026 11.17.58 PM ******/
CREATE TYPE [dbo].[ActivityLogType] AS TABLE(
	[UserId] [int] NULL,
	[CompanyId] [int] NULL,
	[Action] [nvarchar](200) NOT NULL,
	[Entity] [nvarchar](100) NULL,
	[EntityId] [nvarchar](100) NULL,
	[Details] [nvarchar](max) NULL,
	[OldValues] [nvarchar](max) NULL,
	[NewValues] [nvarchar](max) NULL,
	[RequestBody] [nvarchar](max) NULL,
	[Parameters] [nvarchar](max) NULL,
	[IpAddress] [nvarchar](50) NULL,
	[UserAgent] [nvarchar](500) NULL,
	[RequestUrl] [nvarchar](500) NULL,
	[RequestMethod] [nvarchar](10) NULL,
	[ResponseStatus] [int] NULL,
	[ExecutionTimeMs] [int] NULL,
	[CreatedAt] [datetime2](7) NOT NULL
)
GO
