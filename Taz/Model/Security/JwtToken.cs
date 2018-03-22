using System;

namespace Taz.Model.Security
{
    public class JwtToken
    {
        public string aud { get; set; }
        public int? exp { get; set; }
        public int? iat { get; set; }
        public Guid? id { get; set; }
        public string iss { get; set; }
        public Guid? jti { get; set; }
        public int? nbf { get; set; }
        public string rol { get; set; }
        public string sub { get; set; }
    }
}
