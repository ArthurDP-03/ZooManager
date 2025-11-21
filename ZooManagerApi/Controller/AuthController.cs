using Microsoft.AspNetCore.Mvc;
using ZooManagerApi.DTOs;
using ZooManagerApi.Services.Interfaces;

namespace ZooManagerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUsuarioService _usuarioService;

    public AuthController(IAuthService authService, IUsuarioService usuarioService)
    {
        _authService = authService;
        _usuarioService = usuarioService;
    }

    [HttpPost("registro")]
    public async Task<ActionResult> Registrar(RegistroDto request)
    {
        try 
        {
            var usuario = await _usuarioService.CreateAsync(request);
            return Ok(new { Id = usuario.Id, Nome = usuario.Nome, Email = usuario.Email });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<dynamic>> Login(LoginDto request)
    {
        var resultado = await _authService.LoginAsync(request);
        
        if (resultado == null)
            return Unauthorized("Usuário ou senha inválidos.");

        return Ok(resultado);
    }
}