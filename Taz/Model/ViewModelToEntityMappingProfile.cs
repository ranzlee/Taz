using AutoMapper;
using Taz.Model.Domain;
using Taz.Model.View;
using Taz.Model.View.Security;

namespace Taz.Model
{
    public class ViewToEntityModelMappingProfile : Profile
    {
        public ViewToEntityModelMappingProfile()
        {
            CreateMap<Registration, TazUser>().ForMember(tu => tu.UserName, map => map.MapFrom(vm => vm.Email));
        }
    }
}
