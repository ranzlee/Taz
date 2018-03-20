namespace Taz.Security
{
    public static class Constants
    {
        public static class JwtClaimIdentifiers
        {
            public const string Rol = "rol";
            public static string Id = "id";
        }

        public static class JwtClaims
        {
            public const string AuthenticatedUser = "authenticated_user";
            public const string Administrator = "administrator";
        }

        public static class Policies
        {
            public const string AuthenticatedUser = "AuthenticatedUser";
            public const string Administrator = "Administrator";
        }
    }
}
