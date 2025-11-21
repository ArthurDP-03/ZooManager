using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ZooManagerApi.Configuration;
using ZooManagerApi.DTOs;
using ZooManagerApi.Repositories.Interfaces;
using ZooManagerApi.Services.Interfaces;

namespace ZooManagerApi.Services.Implements;

public class AuthService : IAuthService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly JwtSettings _jwtSettings;

    public AuthService(IUsuarioRepository usuarioRepository, IOptions<JwtSettings> jwtOptions)
    {
        _usuarioRepository = usuarioRepository;
        _jwtSettings = jwtOptions.Value;
    }

    public async Task<dynamic> LoginAsync(LoginDto dto)
    {
        var usuario = await _usuarioRepository.GetByEmailAsync(dto.Email);

        if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.Senha))
        {
            return null;
        }

        var token = GerarTokenJwt(usuario);
        return new 
        { 
            Id = usuario.Id, 
            Nome = usuario.Nome, 
            Email = usuario.Email,
            Token = token 
        };
    }

    private string GerarTokenJwt(ZooManagerApi.Models.Usuario usuario)
    {
        var key = Encoding.ASCII.GetBytes(_jwtSettings.Key);
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email)
            }),
            Expires = DateTime.UtcNow.AddHours(8),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}