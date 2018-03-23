using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Taz.Model.Domain;
using Taz.Model.Security;
using Taz.Security;
using Taz.Services;

namespace Taz.Controllers
{
    [Route("api/[controller]")]
    public class SecurityController : Controller
    {
        readonly UserManager<TazUser> _userManager;
        readonly IEntityContextProvider _entityContextProvider;

        public SecurityController
        (
            UserManager<TazUser> userManager, 
            IEntityContextProvider entityContextProvider
        )
        {
            _userManager = userManager;
            _entityContextProvider = entityContextProvider;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult> GetSecurityPolicies()
        {
            if (User.Identity.IsAuthenticated)
            {
                TazUser user = null;
                var idClaim = User.Claims.FirstOrDefault(c => c.Type == JwtClaimIdentifiers.Id);
                if (idClaim != null) 
                {
                    using (var context = _entityContextProvider.GetContext())
                    {
                        user = await context.FindAsync<TazUser>(idClaim.Value);
                    }    
                }
                if (user == null)
                {
                    return Unauthorized();
                }
            }
            return Ok(Startup.SecurityPolicies);
        }
    }
}
