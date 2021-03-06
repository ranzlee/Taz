using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Taz.Extensions;
using Taz.Model.Domain;
using Taz.Model.Security;
using Taz.ORM;
using Taz.Security;
using Taz.Services;

namespace Taz
{
    public class Startup
    {
        // TODO: get this from a secure source
        const string SecretKey = "iNivDmHLpUA223sqsfhqGbMRdRj1PVkH";

        static List<PolicyMap> _securityPolicies = new List<PolicyMap>();

        public static IEnumerable<PolicyMap> SecurityPolicies 
        { 
            get
            {
                return _securityPolicies.AsReadOnly();
            } 
        }

        readonly SymmetricSecurityKey _signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(SecretKey));

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            ORM.Startup.Start(configuration);
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<EntityContext>(options => options.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
            services.AddSingleton<IJwtFactory, JwtFactory>();
            services.AddSingleton<IEntityContextProvider, EntityContextProvider>();
            services.TryAddTransient<IHttpContextAccessor, HttpContextAccessor>();
            // JWT config
            var jwtAppSettingOptions = Configuration.GetSection(nameof(JwtIssuerOptions));
            services.Configure<JwtIssuerOptions>(options =>
            {
                options.Issuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                options.Audience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)];
                options.SigningCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);
            });
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)],
                ValidateAudience = true,
                ValidAudience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)],
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = _signingKey,
                RequireExpirationTime = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(configureOptions =>
            {
                configureOptions.ClaimsIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                configureOptions.TokenValidationParameters = tokenValidationParameters;
                configureOptions.SaveToken = true;
                //configureOptions.Events = new JwtBearerEvents
                //{
                //    OnTokenValidated = context =>
                //    {
                //        var accessToken = context.SecurityToken as JwtSecurityToken;
                //        if (accessToken != null)
                //        {
                //            ClaimsIdentity identity = context.Principal.Identity as ClaimsIdentity;
                //            if (identity != null)
                //            {
                                
                //            }
                //        }

                //        return Task.CompletedTask;
                //    }
                //};
            });
            // define security policies
            services.AddAuthorization(options =>
            {
                // authenticated user
                options.AddPolicy(Policies.AuthenticatedUser, policy => policy.RequireClaim(JwtClaimIdentifiers.Rol, JwtClaims.AuthenticatedUser));
                _securityPolicies.Add(new PolicyMap { 
                    PolicyName = Policies.AuthenticatedUser, 
                    PolicyType = PolicyTypeEnum.AuthenticatedUser, 
                    Roles = new string[] { JwtClaims.AuthenticatedUser } });
                // admin
                options.AddPolicy(Policies.Administrator, policy => policy
                                  .RequireClaim(JwtClaimIdentifiers.Rol, JwtClaims.AuthenticatedUser)
                                  .RequireClaim(JwtClaimIdentifiers.Rol, JwtClaims.Administrator));
                _securityPolicies.Add(new PolicyMap { 
                    PolicyName = Policies.Administrator, 
                    PolicyType = PolicyTypeEnum.Administrator, 
                    Roles = new string[] { JwtClaims.AuthenticatedUser, JwtClaims.Administrator } });
                // next
            });
            // add identity
            var builder = services.AddIdentityCore<TazUser>(o =>
            {
                // configure identity options
                o.Password.RequireDigit = false;
                o.Password.RequireLowercase = false;
                o.Password.RequireUppercase = false;
                o.Password.RequireNonAlphanumeric = false;
                o.Password.RequiredLength = 6;
            });
            builder = new IdentityBuilder(builder.UserType, typeof(IdentityRole), builder.Services);
            builder.AddEntityFrameworkStores<EntityContext>().AddDefaultTokenProviders();
            // add automapper
            services.AddAutoMapper();
            // MVC and JSON config
            services
                .AddMvc()
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                })
                .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<Startup>());
            // SPA config
            services.AddSpaStaticFiles(configuration =>
                {
                    configuration.RootPath = "ClientApp/dist";
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            app.UseExceptionHandler(
            builder =>
            {
                builder.Run(
                          async context =>
                          {
                              context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                              context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
                              var error = context.Features.Get<IExceptionHandlerFeature>();
                              if (error != null)
                              {
                                  context.Response.AddApplicationError(error.Error.Message);
                                  await context.Response.WriteAsync(error.Error.Message).ConfigureAwait(false);
                              }
                          });
            });
            app.UseAuthentication();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });
            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
