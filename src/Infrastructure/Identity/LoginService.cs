using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Application.Authentication.Models;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CleanArchitecture.Infrastructure.Identity;
public class LoginService : ILoginService
{
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    public LoginService(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager, ApplicationDbContext context,
        IConfiguration configuration)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _context = context;
        _configuration = configuration;
    }

    private async Task<UserModel> SignIn(ApplicationUser user, string deviceId = null, System.Threading.CancellationToken cancellationToken = default)
    {
        if (user is null)
        {
            throw new Exception("User not found");
        }

        var userRole = await _userManager.GetRolesAsync(user);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["SecurityKey"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.GivenName, user.UserName),
                new Claim("UserId", user.Id),
                new Claim(ClaimTypes.Role, userRole.FirstOrDefault() ?? "User"),
                new Claim(ClaimTypes.MobilePhone, user.PhoneNumber ?? ""),
            };

        var expiryDate = DateTime.Now.AddYears(1);
        var accesstoken = new JwtSecurityToken(
            issuer: "bphealthcare.com",
            audience: "bphealthcare.com",
            claims: claims,
            expires: expiryDate,
            signingCredentials: creds);


        var userModel = new UserModel
        {
            UserId = user.Id,
            Role = userRole.FirstOrDefault() ?? "User",
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
        };

        return userModel;
    }

    public async Task<UserModel> SignInAsync(LoginModel loginModel)
    {

        var result = await _signInManager.PasswordSignInAsync(loginModel.Email, loginModel.Password, true, lockoutOnFailure: true);
        if (result.Succeeded)
        {
            var user = await _userManager.FindByEmailAsync(loginModel.Email);

            if (result.RequiresTwoFactor)
            {
                //return RedirectToAction(nameof(SendCode), new { model.RememberMe });
            }

            return await SignIn(user, "");
        }
        else
        {
            if (result.IsLockedOut)
            {
                throw new Exception("Too many invalid attempt, you account has been lock. Please contact support for assistant");
            }

            throw new Exception("Invalid login attempt.");
        }

    }


    public async Task<bool> SignOutAsync(string token)
    {
        try
        {
            var userToken = await _context.ApplicationUsers.FirstOrDefaultAsync(x => x.UserName == token);
        }
        catch (Exception)
        {
        }

        return true;
    }
}
