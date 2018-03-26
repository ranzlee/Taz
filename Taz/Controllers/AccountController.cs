using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Taz.Extensions;
using Taz.Model.Domain;
using Taz.Model.View;
using Taz.Model.View.Account;
using Taz.Security;
using Taz.Services;

namespace Taz.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        readonly IEntityContextProvider _entityContextProvider;
        readonly IMapper _mapper;
        readonly IJwtFactory _jwtFactory;
        readonly UserManager<TazUser> _userManager;

        public AccountController
        (
            IEntityContextProvider entityContextProvider,
            IMapper mapper,
            IJwtFactory jwtFactory, 
            UserManager<TazUser> userManager
        )
        {
            _entityContextProvider = entityContextProvider;
            _userManager = userManager;
            _jwtFactory = jwtFactory;
            _mapper = mapper;
        }

        [HttpPost("[action]")]
        public async Task<ObjectResult> Register([FromBody]Registration model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdentity = _mapper.Map<TazUser>(model);
            userIdentity.IsActivated = true;
            userIdentity.IsDisabled = false;
            userIdentity.IsSuspended = false;

            var result = await _userManager.CreateAsync(userIdentity, model.Password);

            if (!result.Succeeded) return new BadRequestObjectResult(ModelState.AddErrorsToModelState(result));

            using(var context = _entityContextProvider.GetContext())
            {
                await context.SaveOrUpdate(new TazCustomer { IdentityId = userIdentity.Id, Location = model.Location });
            }

            return new OkObjectResult(new StringResponse { Data = "Account created" });
        }

        [HttpPost("[action]")]
        public async Task<ObjectResult> Login([FromBody]Credentials credentials)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var identity = await GetClaimsIdentity(credentials.UserName, credentials.Password);
            if (identity.ClaimsIdentity == null)
            {
                return BadRequest(ModelState.AddErrorToModelState("login_failure", identity.ChallengeResult));
            }

            var jwt = await Tokens.GenerateJwt(identity.ClaimsIdentity, _jwtFactory, credentials.UserName);
            return new OkObjectResult(jwt);
        }

        async Task<AuthenticationChallengeResult> GetClaimsIdentity(string userName, string password)
        {
            const string invalidUserNameOrPassword = "Invalid username or password.";
            const string accountNotActivated = "Account has not been activated.";
            const string accountSuspended = "Account is suspended.";
            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(password))
            {
                return await BuildClaimsIdentity(null, invalidUserNameOrPassword);
            }
            // get the user to verifty
            var userToVerify = await _userManager.FindByNameAsync(userName);
            // user name is invalid
            if (userToVerify == null) 
            {
                return await BuildClaimsIdentity(null, invalidUserNameOrPassword);
            }
            // check the credentials
            if (await _userManager.CheckPasswordAsync(userToVerify, password))
            {
                if (!userToVerify.IsActivated)
                {
                    return await BuildClaimsIdentity(null, accountNotActivated);
                }
                if (userToVerify.IsDisabled)
                {
                    return await BuildClaimsIdentity(null, invalidUserNameOrPassword);
                }
                if (userToVerify.IsSuspended)
                {
                    return await BuildClaimsIdentity(null, accountSuspended);
                }
                return await BuildClaimsIdentity(_jwtFactory.GenerateClaimsIdentity(userName, userToVerify.Id), "");
            }
            // password is invalid
            return await BuildClaimsIdentity(null, invalidUserNameOrPassword);
        }

        async Task<AuthenticationChallengeResult> BuildClaimsIdentity(ClaimsIdentity claimsIdentity, string challengeResult)
        {
            return await Task.FromResult(
                new AuthenticationChallengeResult
                {
                    ClaimsIdentity = claimsIdentity,
                    ChallengeResult = challengeResult
                });
        }
    }
}
