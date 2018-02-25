using Autofac;
using Taz.ORM;
using Taz.Services;

namespace Taz.IoC
{
    public class DefaultModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            //bind taz infrastructure providers to service contracts
            builder.RegisterType<EntityContextProvider>().As<IEntityContextProvider>();
        }
    }
}