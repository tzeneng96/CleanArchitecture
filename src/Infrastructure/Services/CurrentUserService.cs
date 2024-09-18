using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.Services.WebApi.Jwt;

namespace CleanArchitecture.Infrastructure.Services;
public class CurrentUserService: ICurrentUserService
{
    public CurrentUserService(IHttpContextAccessor httpContextAccessor, IConfiguration configuration, IApplicationDbContext context)
    {
        ExternalToken = httpContextAccessor.HttpContext?.Request?.Query["ExternalToken"];
        Token = httpContextAccessor.HttpContext?.Request?.Headers["AccessToken"];
        if (string.IsNullOrEmpty(Token))
        {
            Token = httpContextAccessor.HttpContext?.Request?.Query["AccessToken"];
        }

        try
        {
            if (!string.IsNullOrEmpty(Token))
            {
                var securityKey = configuration["SecurityKey"];
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var user = new JwtSecurityTokenHandler().ReadJwtToken(Token);
                TokenValidationParameters validationParameters =
                new TokenValidationParameters
                {
                    ValidIssuer = "bphealthcare.com",
                    ValidAudiences = new[] { "bphealthcare.com" },
                    IssuerSigningKeys = new[] { key }
                };
                var principal = new JwtSecurityTokenHandler().ValidateToken(Token, validationParameters, out var validatedToken);
                var now = DateTime.UtcNow;
                if (user != null)
                {
                    if (now >= validatedToken.ValidFrom && now <= validatedToken.ValidTo)
                    {
                        var userClaims = user.Claims.ToList();
                        if (userClaims.Any())
                        {
                            var hasId = userClaims.FirstOrDefault(x => x.Type == "UserId")?.Value;
                            if (string.IsNullOrEmpty(hasId))
                            {
                                throw new Exception("Token Not Found");
                            }

                            string staffIdStr = userClaims.FirstOrDefault(x => x.Type == "StaffId")?.Value;
                            long? staffId = null;
                            if (!string.IsNullOrEmpty(staffIdStr) && long.TryParse(staffIdStr, out long sId))
                            {
                                staffId = sId;
                            }

                            string branchCodeStr = userClaims.FirstOrDefault(x => x.Type == "BranchCodes")?.Value;


                            User = new UserModel
                            {
                                UserName = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.GivenName)?.Value,
                                Email = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value,
                                UserId = userClaims.FirstOrDefault(x => x.Type == "UserId")?.Value,
                                Role = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value,
                                PhoneNumber = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.MobilePhone)?.Value ?? "",
                            };
                        }
                    }
                    else
                    {
                        throw new TokenExpiredException();
                    }
                }
            }
        }
        catch (System.Exception ex)
        {
            if (ex is SecurityTokenExpiredException || ex is TokenExpiredException)
            {
                throw;
            }
        }
    }

    public string ExternalToken { get; }
    public string Token { get; }
    public UserModel User { get; }

}
