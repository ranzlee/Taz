using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Taz.Domain
{
    public class FakeEntity : Entity
    {
        public string Name { get; set; }

        public int? RootId { get; set; }

        public int? ParentId { get; set; }

        [ForeignKey("ParentId")]
        public virtual FakeEntity Parent { get; set; }

        [ForeignKey("RootId")]
        public virtual FakeEntity Root { get; set; }

        [InverseProperty("Parent")]
        public virtual ICollection<FakeEntity> Children { get; set; }

        [InverseProperty("Root")]
        public virtual ICollection<FakeEntity> RootCollection { get; set; }
    }
}
