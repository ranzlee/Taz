using System.Security.Claims;

namespace Taz.Security
{
    public class AuthenticationChallengeResult
    {
        public ClaimsIdentity ClaimsIdentity { get; set; }
        public string ChallengeResult { get; set; }
    }
}
