using Corporation.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Corporation.Domain.Entities
{
    public class Employee
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public DateOnly BirthDate { get; set; }
        public DateOnly HireDate { get; set; }
        public decimal Salary { get; set; }
        public int DepartmentId { get; set; }
        public Department? Department { get; set; }
    }
}
