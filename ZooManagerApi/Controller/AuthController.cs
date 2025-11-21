using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ZooManagerApi.Data;
using ZooManagerApi.DTOs;
using ZooManagerApi.Models;

namespace ZooManagerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ZooContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(ZooContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("registro")]
    public async Task<ActionResult<UsuarioDto>> Registrar(RegistroDto request)
    {
        if (await _context.Usuarios.AnyAsync(u => u.Email == request.Email))
            return BadRequest("Este e-mail já está em uso.");

        var usuario = new Usuario
        {
            Nome = request.Nome,
            Email = request.Email,
            Senha = BCrypt.Net.BCrypt.HashPassword(request.Senha)
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return Ok(new UsuarioDto { Id = usuario.Id, Nome = usuario.Nome, Email = usuario.Email });
    }

    [HttpPost("login")]
    public async Task<ActionResult<dynamic>> Login(LoginDto request)
    {
        var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.Senha, usuario.Senha))
            return Unauthorized("Usuário ou senha inválidos.");

        // ⭐ GERAÇÃO DO TOKEN ⭐
        var token = GerarTokenJwt(usuario);

        // Retorna o Token para o Front-end
        return Ok(new 
        { 
            Id = usuario.Id, 
            Nome = usuario.Nome, 
            Email = usuario.Email,
            Token = token 
        });
    }

    private string GerarTokenJwt(Usuario usuario)
    {
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
        var tokenHandler = new JwtSecurityTokenHandler();
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email)
            }),
            Expires = DateTime.UtcNow.AddHours(8), // Token válido por 8 horas
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}