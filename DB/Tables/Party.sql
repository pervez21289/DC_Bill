USE [DCBill_Dev]
GO

/****** Object:  Table [dbo].[Party]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Party](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PartyName] [nvarchar](200) NOT NULL,
	[Address] [nvarchar](500) NULL,
	[City] [nvarchar](100) NULL,
	[State] [nvarchar](100) NULL,
	[PinCode] [nvarchar](20) NULL,
	[GSTIN] [nvarchar](50) NULL,
	[Mobile] [nvarchar](20) NULL,
	[Email] [nvarchar](100) NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime] NULL,
	[IsDeleted] [bit] NOT NULL,
	[CompanyId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
