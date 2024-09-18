using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace CleanArchitecture.Infrastructure.Data;
public class ApplicationDbContextSeed
{
    public static async Task SeedDefaultUserAsync(UserManager<ApplicationUser> userManager)
    {
        var defaultUser = new ApplicationUser { UserName = "system@doctor2u.my", Email = "system@doctor2u.my", NormalizedUserName = "System" };
        if (userManager.Users.All(u => u.UserName != defaultUser.UserName))
        {
            await userManager.CreateAsync(defaultUser);
            await userManager.AddToRoleAsync(defaultUser, "Administrator");
        }
    }

    public static async Task SeedDefaultRole(RoleManager<IdentityRole> roleManager)
    {
        if (!roleManager.Roles.Any())
        {
            var adminRole = new IdentityRole { Name = "Administrator" };

            await roleManager.CreateAsync(adminRole);

        }
    }


}
