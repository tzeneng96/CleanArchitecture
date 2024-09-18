using Microsoft.AspNetCore.Identity;

namespace CleanArchitecture.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public string Skillsets { get; set; }
    public string Hobby { get; set; }
}
