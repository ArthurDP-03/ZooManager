using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ZooManagerApi.DTOs;
using ZooManagerApi.Services.Interfaces;

namespace ZooManagerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class AnimalController : ControllerBase
{
    private readonly IAnimalService _service;
    public AnimalController(IAnimalService service) => _service = service;
    private int GetUserId()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (idClaim == null) throw new UnauthorizedAccessException("Token inválido.");
        return int.Parse(idClaim.Value);
    }

    [HttpGet]
    public async Task<ActionResult> GetAnimais()
    {
        return Ok(await _service.GetAllAsync(GetUserId()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetAnimal(int id)
    {
        var animal = await _service.GetByIdAsync(id, GetUserId());
        return animal == null ? NotFound() : Ok(animal);
    }

    [HttpPost]
    public async Task<ActionResult> PostAnimal(AnimalDto dto)
    {
        try {
            dto.UsuarioId = GetUserId();
            
            var animal = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetAnimal), new { id = animal.Id }, animal);
        } catch (Exception ex) {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutAnimal(int id, AnimalDto dto)
    {
        try {
            await _service.UpdateAsync(id, dto, GetUserId());
            return NoContent();
        } 
        catch (UnauthorizedAccessException) { return Forbid(); } // Retorna 403 se tentar hackear
        catch (Exception ex) {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAnimal(int id)
    {
        try {
            await _service.DeleteAsync(id, GetUserId());
            return NoContent();
        }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }
}