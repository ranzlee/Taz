using Microsoft.AspNetCore.Identity;

namespace Taz.Model.Domain
{
    public class TazUser : IdentityUser
    {
        public bool IsActivated { get; set; }
        public bool IsSuspended { get; set; }
        public bool IsDisabled { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public long? FacebookId { get; set; }
        public string PictureUrl { get; set; }
    }
}
