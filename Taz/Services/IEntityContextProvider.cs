using Taz.ORM;

namespace Taz.Services
{
    public interface IEntityContextProvider
    {
        EntityContext GetContext();
    }
}
