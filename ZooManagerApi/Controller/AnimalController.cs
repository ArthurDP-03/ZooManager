using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZooManagerApi.Data;
using ZooManagerApi.DTOs;
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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AnimalResponseDto>>> GetAnimais()
    {
        return await _context.Animais
            .Include(a => a.Usuario)
            .Select(a => new AnimalResponseDto
            {
                Id = a.Id,
                Nome = a.Nome ?? "",
                Descricao = a.Descricao,
                DataNascimento = a.DataNascimento,
                Habitat = a.Habitat,
                PaisOrigem = a.PaisOrigem,
                NomeDono = a.Usuario != null ? a.Usuario.Nome : "Sem Dono"
            })
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AnimalResponseDto>> GetAnimal(int id)
    {
        var a = await _context.Animais.Include(a => a.Usuario).FirstOrDefaultAsync(x => x.Id == id);
        if (a == null) return NotFound();

        return Ok(new AnimalResponseDto
        {
            Id = a.Id,
            Nome = a.Nome ?? "",
            Descricao = a.Descricao,
            DataNascimento = a.DataNascimento,
            Habitat = a.Habitat,
            PaisOrigem = a.PaisOrigem,
            NomeDono = a.Usuario?.Nome ?? "Sem Dono"
        });
    }

    [HttpPost]
    public async Task<ActionResult<AnimalResponseDto>> PostAnimal(AnimalDto dto)
    {
        if (!await _context.Usuarios.AnyAsync(u => u.Id == dto.UsuarioId))
            return BadRequest("Usuário dono não encontrado.");

        var animal = new Animal
        {
            Nome = dto.Nome,
            Descricao = dto.Descricao,
            DataNascimento = dto.DataNascimento,
            Habitat = dto.Habitat,
            PaisOrigem = dto.PaisOrigem,
            UsuarioId = dto.UsuarioId
        };

        _context.Animais.Add(animal);
        await _context.SaveChangesAsync();

        // Busca nome do dono para retorno correto
        var nomeDono = await _context.Usuarios.Where(u => u.Id == dto.UsuarioId).Select(u => u.Nome).FirstOrDefaultAsync();

        return CreatedAtAction(nameof(GetAnimal), new { id = animal.Id }, new AnimalResponseDto
        {
            Id = animal.Id,
            Nome = animal.Nome,
            Descricao = animal.Descricao,
            DataNascimento = animal.DataNascimento,
            Habitat = animal.Habitat,
            PaisOrigem = animal.PaisOrigem,
            NomeDono = nomeDono ?? ""
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutAnimal(int id, AnimalDto dto)
    {
        var animal = await _context.Animais.FindAsync(id);
        if (animal == null) return NotFound();

        animal.Nome = dto.Nome;
        animal.Descricao = dto.Descricao;
        animal.DataNascimento = dto.DataNascimento;
        animal.Habitat = dto.Habitat;
        animal.PaisOrigem = dto.PaisOrigem;
        // Não permitimos trocar o dono no update simples por segurança, mas poderia.

        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException) { if (!_context.Animais.Any(e => e.Id == id)) return NotFound(); else throw; }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAnimal(int id)
    {
        var animal = await _context.Animais.FindAsync(id);
        if (animal == null) return NotFound();
        _context.Animais.Remove(animal);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}