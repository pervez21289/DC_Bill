using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Core.Entities
{
        public class ItemMaster
        {
            public int Id { get; set; }
            public string ItemName { get; set; }
            public string HsnCode { get; set; }
            public decimal Rate { get; set; }
            public int GST { get; set; }
            public DateTime CreatedDate { get; set; }
            public DateTime? UpdatedDate { get; set; }
        }
}
