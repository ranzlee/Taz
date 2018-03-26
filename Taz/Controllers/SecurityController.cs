using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Taz.Model.Domain;
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
                //we have a token, but the user has either been deleted, disabled, or suspended since last authentication
                if (user == null || user.IsDisabled || user.IsSuspended)
                {
                    return Unauthorized();
                }
            }
            return Ok(Startup.SecurityPolicies);
        }
    }
}
