using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Taz.Model.Domain;

namespace Taz.ORM
{
    public class EntityContext : IdentityDbContext<TazUser>
    {
        readonly IConfiguration _configuration;

        public EntityContext() {}

        public EntityContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (_configuration == null) return;
            optionsBuilder.UseSqlite(_configuration.GetConnectionString("DefaultConnection"));
        }

        public async Task<T> SaveOrUpdate<T>(T entity) where T : Entity
        {
            if (entity.Id == 0)
            {
                await base.AddAsync(entity);
            }
            else
            {
                base.Update(entity);
            }
            await base.SaveChangesAsync();
            return entity;
        }

        public DbSet<TazCustomer> TazCustomers { get; set; }
        public DbSet<FakeEntity> FakeEntities { get; set; }
    }
}
