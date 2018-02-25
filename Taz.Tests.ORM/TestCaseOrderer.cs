using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Xunit.Abstractions;
using Xunit.Sdk;

namespace Taz.Tests.ORM
{
    public class TestCaseOrderer : ITestCaseOrderer
    {
        public const string TypeName = "Taz.Tests.ORM.TestCaseOrderer";

        public const string AssembyName = "Taz.Tests.ORM";

        public static readonly ConcurrentDictionary<string, ConcurrentQueue<string>> QueuedTests = new ConcurrentDictionary<string, ConcurrentQueue<string>>();

        public IEnumerable<TTestCase> OrderTestCases<TTestCase>(IEnumerable<TTestCase> testCases) where TTestCase : ITestCase
        {
            return testCases.OrderBy(GetOrder);
        }

        static int GetOrder<TTestCase>(TTestCase testCase) where TTestCase : ITestCase
        {
            QueuedTests
                .GetOrAdd(testCase.TestMethod.TestClass.Class.Name, key => new ConcurrentQueue<string>())
                .Enqueue(testCase.TestMethod.Method.Name);

            var attr = testCase.TestMethod.Method
                .ToRuntimeMethod()
                .GetCustomAttribute<OrderAttribute>();
            return attr?.I ?? 0;
        }
    }
}
