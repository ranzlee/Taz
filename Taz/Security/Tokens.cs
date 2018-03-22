using System.Security.Claims;
using System.Threading.Tasks;
using Taz.Model.Security;
using Taz.Services;

namespace Taz.Security
{
    public static class Tokens
    {
        public static async Task<AuthenticationTokenResponse> GenerateJwt(ClaimsIdentity identity, IJwtFactory jwtFactory, string userName)
        {
            return new AuthenticationTokenResponse
            {
                AccessToken = await jwtFactory.GenerateEncodedToken(userName, identity)
            };
        }
    }
}
