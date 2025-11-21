using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

    [HttpGet]
    public async Task<ActionResult> GetAnimais() => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult> GetAnimal(int id)
    {
        var animal = await _service.GetByIdAsync(id);
        return animal == null ? NotFound() : Ok(animal);
    }

    [HttpPost]
    public async Task<ActionResult> PostAnimal(AnimalDto dto)
    {
        try {
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
            await _service.UpdateAsync(id, dto);
            return NoContent();
        } catch (Exception ex) {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAnimal(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}