using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;

namespace CleanArchitecture.Application.User.Commands;
public class CreateUserCommand: IRequest<Unit>
{
    public UserModel UserModel { get; set; }

    class Handler : IRequestHandler<CreateUserCommand, Unit>
    {
        private readonly IIdentityService _identityService;

        public Handler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<Unit> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            await _identityService.CreateUserAsync(request.UserModel,"Test@1234");
            return Unit.Value;
        }
    }
}
