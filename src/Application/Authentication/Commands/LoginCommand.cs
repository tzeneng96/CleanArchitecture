using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Application.Authentication.Models;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;

namespace CleanArchitecture.Application.Authentication.Commands;
public  class LoginCommand: IRequest<UserModel>
{
    public LoginModel LoginModel { get; set; }
    class Handler : IRequestHandler<LoginCommand, UserModel>
    {
        private readonly ILoginService _loginService;

        public Handler(ILoginService loginService)
        {
            _loginService = loginService;
        }

        public async Task<UserModel> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            return await _loginService.SignInAsync(request.LoginModel);
        }
    }
}
