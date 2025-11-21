using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

    [HttpGet]
    public async Task<ActionResult> GetCuidados() => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult> GetCuidado(int id)
    {
        var cuidado = await _service.GetByIdAsync(id);
        return cuidado == null ? NotFound() : Ok(cuidado);
    }

    [HttpPost]
    public async Task<ActionResult> PostCuidado(CuidadoDto dto)
    {
        try {
            var cuidado = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetCuidado), new { id = cuidado.Id }, cuidado);
        } catch (Exception ex) {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutCuidado(int id, CuidadoDto dto)
    {
        try {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        } catch (Exception ex) {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCuidado(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}