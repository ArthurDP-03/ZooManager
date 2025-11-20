using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZooManagerApi.Data;
using ZooManagerApi.DTOs;
using ZooManagerApi.Models;

namespace ZooManagerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ZooContext _context;

    public AuthController(ZooContext context)
    {
        _context = context;
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
    public async Task<ActionResult<UsuarioDto>> Login(LoginDto request)
    {
        var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.Senha, usuario.Senha))
            return Unauthorized("Usuário ou senha inválidos.");

        return Ok(new UsuarioDto { Id = usuario.Id, Nome = usuario.Nome, Email = usuario.Email });
    }
}