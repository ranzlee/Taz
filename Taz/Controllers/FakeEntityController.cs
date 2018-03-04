using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Taz.Domain;
using Taz.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Taz.Controllers
{
    [Route("api/[controller]")]
    public class FakeEntityController : Controller
    {
        readonly IEntityContextProvider _entityContextProvider;

        public FakeEntityController
        (
            IEntityContextProvider entityContextProvider
        )
        {
            _entityContextProvider = entityContextProvider;
        }

        [HttpPost("[action]")]
        public async Task<FakeEntity> AddOrUpdateFakeEntity([FromBody] FakeEntity fakeEntity)
        {
            using (var context = _entityContextProvider.GetContext())
            {
                var ent = await context.SaveOrUpdate(fakeEntity);
                if (!ent.ParentId.HasValue)
                {
                    ent.RootId = ent.Id;
                    ent = await context.SaveOrUpdate(fakeEntity);
                }
                return ent;
            }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveFakeEntity([FromBody] FakeEntity fakeEntity)
        {
            using (var context = _entityContextProvider.GetContext())
            {
                //get entire branch
                var ent = await context.FakeEntities
                    .Where(i => fakeEntity.RootId.HasValue ? i.Id == fakeEntity.RootId.Value : i.Id == fakeEntity.Id)
                    .AsTracking()
                    .Include(i => i.RootCollection)
                    .SingleOrDefaultAsync();
                //create stack to delete
                if (ent == null) return Ok();
                ent = ent.Id == fakeEntity.Id
                    ? ent
                    : ent.RootCollection.SingleOrDefault(i => i.Id == fakeEntity.Id);
                var stack = new Stack();
                stack.Push(ent);
                if (ent.Children != null) PushStack(stack, ent.Children);
                //pop stack and delete
                while (stack.Count > 0)
                {
                    context.Remove(stack.Pop());
                }
                await context.SaveChangesAsync();
            }
            return Ok();
        }

        void PushStack(Stack stack, IEnumerable<FakeEntity> l)
        {
            foreach (var item in l)
            {
                stack.Push(item);
                if (item.Children != null && item.Children.Any())
                {
                    PushStack(stack, item.Children);
                }
            }
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<FakeEntity>> GetFakeEntities(int parentId)
        {
            int? pid = null;
            if (parentId != 0) pid = parentId;
            using (var context = _entityContextProvider.GetContext())
            {
                var l = await context.FakeEntities
                    .Where(i => i.ParentId == pid)
                    .AsNoTracking()
                    .ToListAsync();
                return l;
            }
        }
    }
}
