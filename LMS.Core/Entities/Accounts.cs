using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
	public class Accounts
	{
		public int AccountId { get; set; } = 0;
		public string Name { get; set; }
        public string SalesOwner { get; set; } = "";
        public int? NoOfEmployees { get; set; }
		public decimal? AnnualRevenue { get; set; }
		public int IndustryTypeId { get; set; }
		public int BusinessTypeId { get; set; }
		public string Address { get; set; } = "";
		public string City { get; set; } = "";
		public int? StateId { get; set; }
		public string Zipcode { get; set; } = "";
		public string Country { get; set; } = "";
		public string LastContactTime { get; set; } = "";
		public int  LastContactMode { get; set; }
		public string LastActivityTypeId { get; set; } = "";
		public DateTime? LastActivityDate { get; set; }
		public string RecentNote { get; set; } = "";
		public int CreatedBy { get; set; }
		//public string CreatedAt { get; set; } = "";
		public int UpdatedBy { get; set; }
		//public string UpdatedDate { get; set; } = "";

		//public string IndustryTypeName { get; set; } = "";
		//public string BusinessTypeName { get; set; } = "";
		//public string ContactModeName { get; set; } = "";
	}
}
