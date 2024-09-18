using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;

namespace CleanArchitecture.Application.User.Commands;
public class UpsertUserCommand : IRequest<Unit>
{
    public UserModel Model { get; set; }
    class Handler :IRequestHandler<UpsertUserCommand, Unit>
    {
        private readonly IIdentityService _identityService;

        public Handler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<Unit> Handle(UpsertUserCommand request, CancellationToken cancellationToken)
        {
            await _identityService.UpdateUserAsync(request.Model);
            return Unit.Value;
        }
    }
}
