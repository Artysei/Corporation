using Corporation.Application.Employees.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Corporation.Application.Employees
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeDto>> GetAsync(
            EmployeeFilterDto filter,
            CancellationToken ct = default);

        Task<EmployeeDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<int> CreateAsync(EmployeeDto dto, CancellationToken ct = default);
        Task UpdateAsync(int id, EmployeeDto dto, CancellationToken ct = default);
        Task DeleteAsync(int id, CancellationToken ct = default);
    }
}