USE [DCBill_Dev]
GO

/****** Object:  Table [dbo].[BillingSettings]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BillingSettings](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NULL,
	[CompanyName] [nvarchar](200) NOT NULL,
	[GSTIN] [varchar](50) NULL,
	[MobileNumber] [varchar](50) NULL,
	[Address] [varchar](20) NULL,
	[City] [varchar](200) NULL,
	[PinCode] [varchar](50) NULL,
	[State] [varchar](100) NULL,
	[Country] [varchar](100) NULL,
	[CreatedDate] [datetime] NOT NULL,
	[UpdatedDate] [datetime] NULL,
	[UPI] [varchar](100) NULL,
 CONSTRAINT [PK__BillingS__3214EC075E03417C] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
