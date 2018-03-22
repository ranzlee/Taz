namespace Taz.Model.Security
{
    public class PolicyMap
    {
        public string PolicyName { get; set; }
        public PolicyTypeEnum PolicyType { get; set; } 
        public string[] Roles { get; set; }
    }
}
