using System.Drawing.Printing;
using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Application.User.Commands;
using CleanArchitecture.Application.User.Queries;
using Doctor2U.LIS.WebUI.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Web.Controllers;
public class UserController : ApiController
{

    [HttpDelete]
    public async Task<ActionResult<Unit>> DeleteUser([FromBody] DeleteUserCommand command, CancellationToken cancellationToken)
       => Ok(await Mediator.Send(command, cancellationToken));

    [HttpPut]
    public async Task<ActionResult> UpdateUser([FromBody] UpsertUserCommand command)
         => Ok(await Mediator.Send(command));

    [HttpGet]
    public async Task<ActionResult<PaginatedList<UserModel>>> QueryUsers(int pageNum, int pageSize, string searchString)
    {
        return Ok(await Mediator.Send(new QueryAllUsers { PageNumber = pageNum, PageSize = pageSize, SearchString = searchString }));
    }

    [HttpGet]
    public async Task<ActionResult<UserModel>> QueryUserById(string userId)
    {
        return Ok(await Mediator.Send(new QueryUserById { UserId = userId }));
    }

    [HttpPost]
    public async Task<ActionResult<Unit>> CreateUser(UserModel userModel)
    {
        return Ok(await Mediator.Send(new CreateUserCommand { UserModel = userModel}));
    }

}
