using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Application.User.Commands;

namespace CleanArchitecture.Application.User.Queries;
public class QueryUserById: IRequest<UserModel>
{
    public string UserId { get; set; }

    class Handler: IRequestHandler<QueryUserById, UserModel>
    {
        private readonly IIdentityService _identityService;

        public Handler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<UserModel> Handle(QueryUserById request, CancellationToken cancellationToken)
        {
            return await _identityService.GetUserAsync(request.UserId);
        }
    }
}
