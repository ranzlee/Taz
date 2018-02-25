using Taz.Domain;
using Reinforced.Typings.Fluent;

namespace Taz
{
    public static class ReinforcedTypingsConfiguration
    {
        public static void Configure(ConfigurationBuilder builder)
        {
            // fluent configuration goes here
            builder.ExportAsInterfaces(new[]{
                typeof(Entity),
                typeof(FakeEntity)
            }, c => c.WithPublicProperties(p => p.ForceNullable()));

            builder.Global(x => {
                x.CamelCaseForProperties();
                x.UseModules(true, false);
                x.ExportPureTypings();
            });
        }
    }
}