using ZooManagerApi.DTOs;

namespace ZooManagerApi.Services.Interfaces;

public interface IAuthService
{
    Task<dynamic> LoginAsync(LoginDto dto);
}