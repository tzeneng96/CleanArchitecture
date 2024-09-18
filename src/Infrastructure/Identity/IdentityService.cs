using System.Threading;
using Azure.Core;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Mappings;
using CleanArchitecture.Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Services.Profile;

namespace CleanArchitecture.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IUserClaimsPrincipalFactory<ApplicationUser> _userClaimsPrincipalFactory;
    private readonly IAuthorizationService _authorizationService;

    public IdentityService(
        UserManager<ApplicationUser> userManager,
        IUserClaimsPrincipalFactory<ApplicationUser> userClaimsPrincipalFactory,
        IAuthorizationService authorizationService)
    {
        _userManager = userManager;
        _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
        _authorizationService = authorizationService;
    }

    public async Task<UserModel> GetUserAsync(string userId)
    {
        var user = await _userManager.Users.FirstAsync(u => u.Id == userId);
        var userRole = await _userManager.GetRolesAsync(user);
        return new UserModel
        {
            UserName = user.UserName,
            UserId = user.Id,
            PhoneNumber = user.PhoneNumber,
            Role = userRole.FirstOrDefault() ?? "User",
            Hobby = user.Hobby,
            Skillsets = user.Skillsets,
            Email = user.Email,
            IsLocked = user.LockoutEnabled,
        };
    }

    public async Task<PaginatedList<UserModel>> GetAllUsers(int pageNum, int pageSize, string searchString)
    {
        var query = _userManager.Users
                                .Where(x => string.IsNullOrEmpty(searchString) || x.UserName.Contains(searchString) || x.Email.Contains(searchString))
                                .Select(x => new UserModel
                                {
                                    IsLocked = x.LockoutEnabled,
                                    UserId = x.Id,
                                    PhoneNumber = x.PhoneNumber,
                                    UserName = x.UserName,
                                    Email = x.Email,
                                    Skillsets = x.Skillsets ?? string.Empty,  // Handle null values
                                    Hobby = x.Hobby ?? string.Empty
                                });

        var paginatedUsers = await PaginatedList<UserModel>.CreateAsync(query, pageNum, pageSize);
        return paginatedUsers;
    }

    public async Task<(Result Result, string UserId)> CreateUserAsync(UserModel userModel, string password)
    {
        var user = new ApplicationUser
        {
            LockoutEnabled = false,
            UserName = userModel.UserName,
            Email = userModel.Email,
            PhoneNumber = userModel.PhoneNumber,
            Hobby = userModel.Hobby,
            Skillsets = userModel.Skillsets,
        };

        var result = await _userManager.CreateAsync(user, password);
        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, userModel.Role);
            return (result.ToApplicationResult(), user.Id);
        }
        else
        {
            throw new System.Exception(result.Errors.FirstOrDefault()?.Description);
        }
    }

    public async Task<bool> UserIsInRoleAsync(string userId, List<string> roles)
    {
        var user = _userManager.Users.SingleOrDefault(u => u.Id == userId);
        var userInRole = false;

        foreach (var r in roles)
        {
            userInRole = await _userManager.IsInRoleAsync(user, r);
            if (userInRole)
            {
                break;
            }
        }

        return user != null && userInRole;
    }

    public async Task<bool> AuthorizeAsync(string userId, string policyName)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return false;
        }

        var principal = await _userClaimsPrincipalFactory.CreateAsync(user);

        var result = await _authorizationService.AuthorizeAsync(principal, policyName);

        return result.Succeeded;
    }

    public async Task<Result> DeleteUserAsync(string userId)
    {
        var user = _userManager.Users.SingleOrDefault(u => u.Id == userId);

        if (user != null)
        {
            var result = await _userManager.DeleteAsync(user);
            return result.ToApplicationResult();
        }

        return Result.Success();
    }

    public async Task<Result> DeleteUserAsync(ApplicationUser user)
    {
        var result = await _userManager.DeleteAsync(user);

        return result.ToApplicationResult();
    }

    public async Task<Result> UpdateUserAsync(UserModel userModel)
    {
        var user = await _userManager.FindByIdAsync(userModel.UserId);
        user.PhoneNumber = userModel.PhoneNumber;
        user.Email = userModel.Email;
        user.LockoutEnabled = userModel.IsLocked;
        user.UserName = userModel.UserName;
        user.Hobby = userModel.Hobby;
        user.Skillsets = userModel.Skillsets;
        var result = await _userManager.UpdateAsync(user);
        return result.ToApplicationResult();
    }
}
