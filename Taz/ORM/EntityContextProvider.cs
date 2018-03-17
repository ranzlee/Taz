using Microsoft.Extensions.Configuration;
using Taz.Services;

namespace Taz.ORM
{
    public class EntityContextProvider : IEntityContextProvider
    {
        readonly IConfiguration _configuration;

        public EntityContextProvider(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public EntityContext GetContext()
        {
            return new EntityContext(_configuration);
        }
    }
}
