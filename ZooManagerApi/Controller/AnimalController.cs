using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZooManagerApi.Data;
using ZooManagerApi.Models;

namespace ZooManagerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AnimalController : ControllerBase
{
    private readonly ZooContext _context;

    public AnimalController(ZooContext context)
    {
        _context = context;
    }

    // GET: api/Animal
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Animal>>> GetAnimais()
    {
        // Note que _context.Animais continua no plural pois vem do ZooContext
        return await _context.Animais
                             .Include(a => a.Usuario) 
                             .ToListAsync();
    }

    // GET: api/Animal/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Animal>> GetAnimal(int id)
    {
        var animal = await _context.Animais
            .Include(a => a.Usuario)
            .Include(a => a.Cuidados)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (animal == null)
        {
            return NotFound();
        }

        return animal;
    }

    // POST: api/Animal
    [HttpPost]
    public async Task<ActionResult<Animal>> PostAnimal(Animal animal)
    {
        if (!_context.Usuarios.Any(u => u.Id == animal.UsuarioId))
        {
            return BadRequest("O UsuarioId informado não existe.");
        }

        _context.Animais.Add(animal);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAnimal), new { id = animal.Id }, animal);
    }

    // PUT: api/Animal/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAnimal(int id, Animal animal)
    {
        if (id != animal.Id)
        {
            return BadRequest();
        }

        if (!_context.Usuarios.Any(u => u.Id == animal.UsuarioId))
        {
            return BadRequest("UsuarioId inválido.");
        }

        _context.Entry(animal).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AnimalExists(id)) return NotFound();
            else throw;
        }

        return NoContent();
    }

    // DELETE: api/Animal/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAnimal(int id)
    {
        var animal = await _context.Animais.FindAsync(id);
        if (animal == null)
        {
            return NotFound();
        }

        _context.Animais.Remove(animal);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool AnimalExists(int id)
    {
        return _context.Animais.Any(e => e.Id == id);
    }
}