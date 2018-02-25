using Xunit;

namespace Taz.Tests.ORM
{
    [TestCaseOrderer(TestCaseOrderer.TypeName, TestCaseOrderer.AssembyName)]
    public class TestClassBase
    {
        protected static int I;

        protected void AssertTestName(string testName)
        {
            var type = GetType();
            var queue = TestCaseOrderer.QueuedTests[type.FullName];
            string dequeuedName;
            var result = queue.TryDequeue(out dequeuedName);
            Assert.True(result);
            Assert.Equal(testName, dequeuedName);
        }
    }
}
