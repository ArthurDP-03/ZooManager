using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZooManagerApi.Data;
using ZooManagerApi.Models;

namespace ZooManagerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CuidadoController : ControllerBase
{
    private readonly ZooContext _context;

    public CuidadoController(ZooContext context)
    {
        _context = context;
    }

    // GET: api/Cuidado
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Cuidado>>> GetCuidados()
    {
        return await _context.Cuidados
                             .Include(c => c.Animal)
                             .ToListAsync();
    }

    // GET: api/Cuidado/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Cuidado>> GetCuidado(int id)
    {
        var cuidado = await _context.Cuidados
            .Include(c => c.Animal)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (cuidado == null)
        {
            return NotFound();
        }

        return cuidado;
    }

    // POST: api/Cuidado
    [HttpPost]
    public async Task<ActionResult<Cuidado>> PostCuidado(Cuidado cuidado)
    {
        if (!_context.Animais.Any(a => a.Id == cuidado.AnimalId))
        {
            return BadRequest("O AnimalId informado não existe.");
        }

        _context.Cuidados.Add(cuidado);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCuidado), new { id = cuidado.Id }, cuidado);
    }

    // PUT: api/Cuidado/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCuidado(int id, Cuidado cuidado)
    {
        if (id != cuidado.Id)
        {
            return BadRequest();
        }

        if (!_context.Animais.Any(a => a.Id == cuidado.AnimalId))
        {
            return BadRequest("AnimalId inválido.");
        }

        _context.Entry(cuidado).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CuidadoExists(id)) return NotFound();
            else throw;
        }

        return NoContent();
    }

    // DELETE: api/Cuidado/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCuidado(int id)
    {
        var cuidado = await _context.Cuidados.FindAsync(id);
        if (cuidado == null)
        {
            return NotFound();
        }

        _context.Cuidados.Remove(cuidado);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CuidadoExists(int id)
    {
        return _context.Cuidados.Any(e => e.Id == id);
    }
}