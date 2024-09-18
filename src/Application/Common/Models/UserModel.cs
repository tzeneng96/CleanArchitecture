﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Common.Models;
public class UserModel
{
    public required string UserId { get; set; }
    public string Skillsets { get; set; }
    public string Hobby { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set;}
    public string Role { get; set; }
    public bool IsLocked { get; set; }
}

