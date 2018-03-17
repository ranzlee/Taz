using System.Linq;
using Taz.Model.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xunit;

[assembly: TestCollectionOrderer(Taz.Tests.ORM.TestCollectionOrderer.TypeName, Taz.Tests.ORM.TestCollectionOrderer.AssembyName)]
[assembly: CollectionBehavior(DisableTestParallelization = true)]

namespace Taz.Tests.ORM
{
    [Order(1)]
    public class UnitTests : TestClassBase
    {
        static IConfiguration _configuration;

        public UnitTests()
        {
            
        }

        [Fact]
        [Order(1)]
        public void CanCreateDbContext()
        {
            _configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            Taz.ORM.Startup.Start(_configuration);
        }

        [Fact]
        [Order(2)]
        public async void CanAddEntitiesToDataStore()
        {
            //Arrange
            using (var context = new Taz.ORM.EntityContext(_configuration))
            {
                //add root
                var fakeRoot = new FakeEntity
                {
                    Name = "Root"
                };
                await context.AddAsync(fakeRoot);
                //add child
                var fakeChild = new FakeEntity
                {
                    Name = "Child",
                    Parent = fakeRoot,
                    Root = fakeRoot
                };
                await context.AddAsync(fakeChild);
                //add grandchild
                var fakeGrandchild = new FakeEntity
                {
                    Name = "Grandchild",
                    Parent = fakeChild,
                    Root = fakeRoot
                };
                await context.AddAsync(fakeGrandchild);
                await context.SaveChangesAsync();
            }
            //Act
            FakeEntity ent;
            using (var context = new Taz.ORM.EntityContext(_configuration))
            {
                ent = await context.FakeEntities
                    .Where(i => i.Name == "Root")
                    .AsTracking()
                    .Include(i => i.RootCollection)
                    .SingleOrDefaultAsync();
            }
            //Assert
            Assert.NotNull(ent);
            Assert.Equal(2, ent.RootCollection.Count());
            Assert.Equal("Root", ent.Name);
            Assert.Equal(1, ent.Children.Count());
            Assert.Equal("Child", ent.Children.First().Name);
            Assert.Equal(1, ent.Children.First().Children.Count());
            Assert.Equal("Grandchild", ent.Children.First().Children.First().Name);
        }

        [Fact]
        [Order(3)]
        public async void CanRemoveEntitiesFromDataStore()
        {
            using (var context = new Taz.ORM.EntityContext(_configuration))
            {
                var ent = await context.FakeEntities
                    .Where(i => i.Name == "Root")
                    .AsTracking()
                    .Include(i => i.RootCollection)
                    .SingleOrDefaultAsync();
                context.RemoveRange(ent.RootCollection);
                context.Remove(ent);
                await context.SaveChangesAsync();
            }
            using (var context = new Taz.ORM.EntityContext(_configuration))
            {
                var fakeEntities = await context.FakeEntities.ToListAsync();
                Assert.Empty(fakeEntities);
            }
        }
    }
}
