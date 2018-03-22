using System;
using Microsoft.AspNetCore.Identity;
using Reinforced.Typings.Ast.TypeNames;
using Reinforced.Typings.Fluent;
using Taz.Model.Domain;
using Taz.Model.Security;
using Taz.Model.View;
using Taz.Model.View.Account;

namespace Taz
{
    public static class ReinforcedTypingsConfiguration
    {
        public static void Configure(ConfigurationBuilder builder)
        {
            // fluent configuration goes here
            builder.ExportAsInterfaces(new[] {
                // ASPNET identity base types
                typeof(IdentityUser<string>),
                typeof(IdentityUser),
                // domain entity models
                typeof(TazUser),
                typeof(Entity),
                typeof(TazCustomer),
                typeof(FakeEntity),
                // view models
                typeof(StringResponse),
                // security models
                typeof(PolicyMap),
                typeof(AuthenticationTokenResponse),
                typeof(Registration),
                typeof(Credentials)
            }, c => c.WithPublicProperties(p => p.ForceNullable()));

            //policy type enum
            builder.ExportAsEnum<PolicyTypeEnum>().Const();
                   
            //JwtToken
            builder.ExportAsInterface<JwtToken>()
                   .WithProperty(p => p.rol, p => p.InferType(t => "string | string[]"))
                   .WithAllProperties(p => p.ForceNullable());
            
            // global type substitutions
            builder.Substitute(typeof(DateTimeOffset), new RtSimpleTypeName("string"));
            builder.Substitute(typeof(Guid), new RtSimpleTypeName("string"));

            // global settings
            builder.Global(x => {
                x.CamelCaseForProperties();
                x.UseModules(true, false);
                x.ExportPureTypings();
            });
        }
    }
}