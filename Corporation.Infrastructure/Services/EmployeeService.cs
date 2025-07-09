using Corporation.Application.Employees.DTO;
using Corporation.Application.Employees;
using Corporation.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Corporation.Infrastructure.Services
{
    public sealed class EmployeeService(ApplicationDbContext db) : IEmployeeService
    {
        public async Task<IEnumerable<EmployeeDto>> GetAsync(EmployeeFilterDto f, CancellationToken ct)
        {
            var q = db.Employees
                      .Include(e => e.Department)
                      .Where(e =>
                      (string.IsNullOrWhiteSpace(f.Department) || e.Department!.Name.Contains(f.Department!)) &&
                      (string.IsNullOrWhiteSpace(f.Name) || e.FullName.Contains(f.Name!)) &&
                      (f.BornFrom == null || e.BirthDate >= f.BornFrom) &&
                      (f.BornTo == null || e.BirthDate <= f.BornTo) &&
                      (f.HiredFrom == null || e.HireDate >= f.HiredFrom) &&
                      (f.HiredTo == null || e.HireDate <= f.HiredTo) &&
                      (f.SalaryFrom == null || e.Salary >= f.SalaryFrom) &&
                      (f.SalaryTo == null || e.Salary <= f.SalaryTo));

            q = (f.OrderBy?.ToLower(), f.Asc) switch
            {
                ("department", true) => q.OrderBy(e => e.Department!.Name),
                ("department", false) => q.OrderByDescending(e => e.Department!.Name),
                ("name", true) => q.OrderBy(e => e.FullName),
                ("name", false) => q.OrderByDescending(e => e.FullName),
                ("birth", true) => q.OrderBy(e => e.BirthDate),
                ("birth", false) => q.OrderByDescending(e => e.BirthDate),
                ("hire", true) => q.OrderBy(e => e.HireDate),
                ("hire", false) => q.OrderByDescending(e => e.HireDate),
                ("salary", true) => q.OrderBy(e => e.Salary),
                ("salary", false) => q.OrderByDescending(e => e.Salary),
                _ => q.OrderBy(e => e.Id)
            };

            return await q.Select(e => new EmployeeDto(
                e.Id,
                e.Department!.Name,
                e.FullName,
                e.BirthDate,
                e.HireDate,
                e.Salary)).ToListAsync(ct);
        }

        public async Task<EmployeeDto?> GetByIdAsync(int id, CancellationToken ct)
            => await db.Employees
                       .Include(e => e.Department)
                       .Where(e => e.Id == id)
                       .Select(e => new EmployeeDto(
                           e.Id, e.Department!.Name, e.FullName, e.BirthDate, e.HireDate, e.Salary))
                       .SingleOrDefaultAsync(ct);

        public async Task<int> CreateAsync(EmployeeDto dto, CancellationToken ct)
        {
            var department = await EnsureDepartment(dto.Department, ct);
            var entity = new Employee
            {
                FullName = dto.FullName,
                BirthDate = dto.BirthDate,
                HireDate = dto.HireDate,
                Salary = dto.Salary,
                Department = department
            };
            db.Employees.Add(entity);
            await db.SaveChangesAsync(ct);
            return entity.Id;
        }

        public async Task UpdateAsync(int id, EmployeeDto dto, CancellationToken ct)
        {
            var entity = await db.Employees.FindAsync(new object?[] { id }, ct)
                         ?? throw new KeyNotFoundException($"Employee {id} not found");

            entity.FullName = dto.FullName;
            entity.BirthDate = dto.BirthDate;
            entity.HireDate = dto.HireDate;
            entity.Salary = dto.Salary;
            entity.Department = await EnsureDepartment(dto.Department, ct);

            await db.SaveChangesAsync(ct);
        }

        public async Task DeleteAsync(int id, CancellationToken ct)
        {
            var entity = await db.Employees.FindAsync(new object?[] { id }, ct);
            if (entity is null) return;

            db.Remove(entity);
            await db.SaveChangesAsync(ct);
        }

        private async Task<Department> EnsureDepartment(string name, CancellationToken ct)
            => await db.Departments.FirstOrDefaultAsync(d => d.Name == name, ct)
               ?? (await db.Departments.AddAsync(new Department { Name = name }, ct)).Entity;
    }
}
