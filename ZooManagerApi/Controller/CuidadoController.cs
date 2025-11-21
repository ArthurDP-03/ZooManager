using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ZooManagerApi.DTOs;
using ZooManagerApi.Services.Interfaces;

namespace ZooManagerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CuidadoController : ControllerBase
{
    private readonly ICuidadoService _service;
    public CuidadoController(ICuidadoService service) => _service = service;

    private int GetUserId()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (idClaim == null) throw new UnauthorizedAccessException("Token inválido.");
        return int.Parse(idClaim.Value);
    }

    [HttpGet]
    public async Task<ActionResult> GetCuidados()
    {
        return Ok(await _service.GetAllAsync(GetUserId()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetCuidado(int id)
    {
        var cuidado = await _service.GetByIdAsync(id, GetUserId());
        return cuidado == null ? NotFound() : Ok(cuidado);
    }

    [HttpPost]
    public async Task<ActionResult> PostCuidado(CuidadoDto dto)
    {
        try {
            var cuidado = await _service.CreateAsync(dto, GetUserId());
            return CreatedAtAction(nameof(GetCuidado), new { id = cuidado.Id }, cuidado);
        } 
        catch (UnauthorizedAccessException) { return Forbid(); }
        catch (Exception ex) {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutCuidado(int id, CuidadoDto dto)
    {
        try {
            await _service.UpdateAsync(id, dto, GetUserId());
            return NoContent();
        } 
        catch (UnauthorizedAccessException) { return Forbid(); }
        catch (Exception ex) {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCuidado(int id)
    {
        try {
            await _service.DeleteAsync(id, GetUserId());
            return NoContent();
        }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }
}