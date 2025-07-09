using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Corporation.Application.Employees.DTO
{
    public record EmployeeDto(
     int Id,
     string Department,
     string FullName,
     DateOnly BirthDate,
     DateOnly HireDate,
     decimal Salary);
}
