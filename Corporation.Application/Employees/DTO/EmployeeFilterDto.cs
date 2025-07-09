using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Corporation.Application.Employees.DTO
{
    public record EmployeeFilterDto
    (
        string? Department,
        string? Name,
        DateOnly? BornFrom,
        DateOnly? BornTo,
        DateOnly? HiredFrom,
        DateOnly? HiredTo,
        decimal? SalaryFrom,
        decimal? SalaryTo,
        string? OrderBy,
        bool Asc
    );
}
