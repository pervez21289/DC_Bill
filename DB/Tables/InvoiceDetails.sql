USE [DCBill_Dev]
GO

/****** Object:  Table [dbo].[InvoiceDetails]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InvoiceDetails](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[InvoiceId] [bigint] NOT NULL,
	[ItemId] [bigint] NOT NULL,
	[ItemName] [varchar](200) NOT NULL,
	[HsnCode] [varchar](50) NOT NULL,
	[Quantity] [decimal](18, 2) NOT NULL,
	[Rate] [decimal](18, 2) NOT NULL,
	[Amount] [decimal](18, 2) NOT NULL,
	[GSTPercent] [int] NOT NULL,
	[GSTAmount] [decimal](18, 2) NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[CGSTAmount] [decimal](18, 2) NULL,
	[SGSTAmount] [decimal](18, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
