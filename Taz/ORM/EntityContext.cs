using System.Threading.Tasks;
using Taz.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Taz.ORM
{
    public class EntityContext : DbContext
    {
        readonly IConfiguration _configuration;

        public EntityContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
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

        public DbSet<FakeEntity> FakeEntities { get; set; }
    }
}
