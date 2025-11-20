using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZooManagerApi.Data;
using ZooManagerApi.DTOs;
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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CuidadoResponseDto>>> GetCuidados()
    {
        return await _context.Cuidados
            .Include(c => c.Animal)
            .Select(c => new CuidadoResponseDto
            {
                Id = c.Id,
                Nome = c.Nome ?? "",
                Descricao = c.Descricao,
                Frequencia = c.Frequencia ?? "",
                NomeAnimal = c.Animal != null ? c.Animal.Nome : "Desconhecido"
            })
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CuidadoResponseDto>> GetCuidado(int id)
    {
        var c = await _context.Cuidados.Include(x => x.Animal).FirstOrDefaultAsync(x => x.Id == id);
        if (c == null) return NotFound();

        return Ok(new CuidadoResponseDto
        {
            Id = c.Id,
            Nome = c.Nome ?? "",
            Descricao = c.Descricao,
            Frequencia = c.Frequencia ?? "",
            NomeAnimal = c.Animal?.Nome ?? "Desconhecido"
        });
    }

    [HttpPost]
    public async Task<ActionResult<CuidadoResponseDto>> PostCuidado(CuidadoDto dto)
    {
        if (!await _context.Animais.AnyAsync(a => a.Id == dto.AnimalId))
            return BadRequest("Animal não encontrado.");

        var cuidado = new Cuidado
        {
            Nome = dto.Nome,
            Descricao = dto.Descricao,
            Frequencia = dto.Frequencia,
            AnimalId = dto.AnimalId
        };

        _context.Cuidados.Add(cuidado);
        await _context.SaveChangesAsync();

        var nomeAnimal = await _context.Animais.Where(a => a.Id == dto.AnimalId).Select(a => a.Nome).FirstOrDefaultAsync();

        return CreatedAtAction(nameof(GetCuidado), new { id = cuidado.Id }, new CuidadoResponseDto
        {
            Id = cuidado.Id,
            Nome = cuidado.Nome,
            Descricao = cuidado.Descricao,
            Frequencia = cuidado.Frequencia,
            NomeAnimal = nomeAnimal ?? ""
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutCuidado(int id, CuidadoDto dto)
    {
        var cuidado = await _context.Cuidados.FindAsync(id);
        if (cuidado == null) return NotFound();

        cuidado.Nome = dto.Nome;
        cuidado.Descricao = dto.Descricao;
        cuidado.Frequencia = dto.Frequencia;

        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException) { if (!_context.Cuidados.Any(e => e.Id == id)) return NotFound(); else throw; }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCuidado(int id)
    {
        var cuidado = await _context.Cuidados.FindAsync(id);
        if (cuidado == null) return NotFound();
        _context.Cuidados.Remove(cuidado);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}