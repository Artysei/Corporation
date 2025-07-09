using Corporation.Domain.Entities;
using Microsoft.EntityFrameworkCore;


namespace Corporation.Infrastructure
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options)
    {
        public DbSet<Employee> Employees => Set<Employee>();
        public DbSet<Department> Departments => Set<Department>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            b.Entity<Employee>(e =>
            {
                e.Property(x => x.FullName).HasMaxLength(200);
                e.Property(x => x.Salary).HasColumnType("money");
            });
        }
    }
}