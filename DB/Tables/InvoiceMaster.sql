USE [DCBill_Dev]
GO

/****** Object:  Table [dbo].[InvoiceMaster]    Script Date: 10-07-2026 11.17.58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InvoiceMaster](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[InvoiceNo] [varchar](50) NOT NULL,
	[InvoiceDate] [date] NOT NULL,
	[PartyId] [bigint] NOT NULL,
	[PartyName] [varchar](200) NOT NULL,
	[PartyAddress] [varchar](500) NULL,
	[PartyCity] [varchar](100) NULL,
	[PartyState] [varchar](100) NULL,
	[PartyPinCode] [varchar](20) NULL,
	[PartyGSTIN] [varchar](50) NULL,
	[Subtotal] [decimal](18, 2) NOT NULL,
	[TotalGST] [decimal](18, 2) NOT NULL,
	[GrandTotal] [decimal](18, 2) NOT NULL,
	[Notes] [varchar](500) NULL,
	[CreatedDate] [datetime] NOT NULL,
	[UpdatedDate] [datetime] NULL,
	[IsDeleted] [bit] NOT NULL,
	[GSTPercent] [decimal](5, 2) NOT NULL,
	[CompanyId] [int] NULL,
	[PaymentStatus] [tinyint] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
