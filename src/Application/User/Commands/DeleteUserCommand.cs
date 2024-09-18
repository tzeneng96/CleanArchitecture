using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;

namespace CleanArchitecture.Application.User.Commands;
public class DeleteUserCommand: IRequest<Unit>
{
    public string UserId { get; set; }

    class Handler : IRequestHandler<DeleteUserCommand, Unit>
    {
        private readonly IIdentityService _identityService;

        public Handler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            await _identityService.DeleteUserAsync(request.UserId);
            return Unit.Value;
        }
    }
}
