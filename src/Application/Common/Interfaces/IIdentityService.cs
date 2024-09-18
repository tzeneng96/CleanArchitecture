using CleanArchitecture.Application.Common.Models;

namespace CleanArchitecture.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<UserModel> GetUserAsync(string userId);
    Task<PaginatedList<UserModel>> GetAllUsers(int pageNum, int pageSize, string searchString);
    Task<bool> UserIsInRoleAsync(string userId, List<string> roles);

    Task<bool> AuthorizeAsync(string userId, string policyName);

    Task<(Result Result, string UserId)> CreateUserAsync(UserModel userModel, string password);

    Task<Result> DeleteUserAsync(string userId);
    Task<Result> UpdateUserAsync(UserModel userModel);

}
