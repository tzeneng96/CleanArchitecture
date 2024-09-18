using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Application.Common.Interfaces;

namespace CleanArchitecture.Application.Authentication.Commands;
public class LogoutCommand: IRequest<bool>
{
    public class Handler : IRequestHandler<LogoutCommand, bool>
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILoginService _loginService;
        public Handler(ILoginService loginService, ICurrentUserService currentUserService)
        {
            _loginService = loginService;
            _currentUserService = currentUserService;
        }

        public async Task<bool> Handle(LogoutCommand request, CancellationToken cancellationToken)
        {
            return await _loginService.SignOutAsync(_currentUserService.Token);
        }

    }
}
