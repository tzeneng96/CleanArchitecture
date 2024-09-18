using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;

namespace CleanArchitecture.Application.User.Queries;
public class QueryAllUsers: IRequest<PaginatedList<UserModel>>
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public string SearchString { get; set; }

    class Handler : IRequestHandler<QueryAllUsers, PaginatedList<UserModel>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IIdentityService _identityService;


        public Handler(IApplicationDbContext context, IMapper mapper, IIdentityService identityService)
        {
            _context = context;
            _mapper = mapper;
            _identityService = identityService;
        }

        public async Task<PaginatedList<UserModel>> Handle(QueryAllUsers request, CancellationToken cancellationToken)
        {
            var result = await _identityService.GetAllUsers(request.PageNumber, request.PageSize, request.SearchString);

            return result;
        }
    }
}
