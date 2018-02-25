using System.ComponentModel.DataAnnotations;

namespace Taz.Domain
{
    public class Entity
    {
        [Key]
        public int Id { get; set; }
    }
}
