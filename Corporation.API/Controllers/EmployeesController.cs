using Corporation.Application.Employees.DTO;
using Corporation.Application.Employees;
using Microsoft.AspNetCore.Mvc;

namespace Corporation.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController(IEmployeeService service) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] EmployeeFilterDto filter, CancellationToken ct)
        => Ok(await service.GetAsync(filter, ct));

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
            => await service.GetByIdAsync(id, ct) is { } dto
               ? Ok(dto)
               : NotFound();

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EmployeeDto dto, CancellationToken ct)
        {
            var id = await service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] EmployeeDto dto, CancellationToken ct)
        {
            await service.UpdateAsync(id, dto, ct);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
        {
            await service.DeleteAsync(id, ct);
            return NoContent();
        }
    }
}
