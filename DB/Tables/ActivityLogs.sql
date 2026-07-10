USE [DCBill_Dev]
GO

/****** Object:  Table [dbo].[ActivityLogs]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ActivityLogs](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NULL,
	[CompanyId] [int] NULL,
	[Action] [varchar](200) NOT NULL,
	[Entity] [varchar](100) NULL,
	[EntityId] [varchar](100) NULL,
	[OldValues] [varchar](max) NULL,
	[NewValues] [varchar](max) NULL,
	[RequestBody] [varchar](max) NULL,
	[Parameters] [varchar](max) NULL,
	[IpAddress] [varchar](50) NULL,
	[UserAgent] [varchar](500) NULL,
	[RequestUrl] [varchar](500) NULL,
	[RequestMethod] [varchar](10) NULL,
	[ResponseStatus] [int] NULL,
	[ExecutionTimeMs] [int] NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
