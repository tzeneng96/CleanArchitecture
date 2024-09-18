using CleanArchitecture.Application.Authentication.Commands;
using CleanArchitecture.Application.Authentication.Models;
using CleanArchitecture.Application.Common.Models;
using Doctor2U.LIS.WebUI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Web.Controllers;
public class AuthenticationController : ApiController
{
    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<UserModel>> Login([FromBody] LoginModel loginModel)
    {
        return Ok(await Mediator.Send(new LoginCommand { LoginModel = loginModel }));
    }

    [HttpPost]
    public async Task<ActionResult<bool>> Logout()
        => Ok(await Mediator.Send(new LogoutCommand()));
}
