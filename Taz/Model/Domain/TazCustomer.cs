namespace Taz.Model.Domain
{
    public class TazCustomer : Entity
    {
        public string IdentityId { get; set; }
        public TazUser Identity { get; set; }
        public string Location { get; set; }
        public string Locale { get; set; }
        public string Gender { get; set; }
    }
}
