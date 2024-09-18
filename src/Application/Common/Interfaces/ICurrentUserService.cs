using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Application.Common.Models;

namespace CleanArchitecture.Application.Common.Interfaces;
public interface ICurrentUserService
{
    string ExternalToken { get; }
    string Token { get; }
    public UserModel User { get; }
}
