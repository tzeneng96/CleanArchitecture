using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Authentication.Models;
public class LoginModel
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string OAuthToken { get; set; }
    public string OAuthId { get; set; }
    public string Username { get; set; }
    public string PhoneNumber { get; set; }

}
