using System.ComponentModel.DataAnnotations;

namespace Taz.Model.Domain
{
    public class Entity
    {
        [Key]
        public int Id { get; set; }
    }
}
