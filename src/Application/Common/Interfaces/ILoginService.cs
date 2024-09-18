using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Application.Authentication.Models;
using CleanArchitecture.Application.Common.Models;

namespace CleanArchitecture.Application.Common.Interfaces;
public interface ILoginService
{

    Task<UserModel> SignInAsync(LoginModel loginModel);
    Task<bool> SignOutAsync(string token);

}
