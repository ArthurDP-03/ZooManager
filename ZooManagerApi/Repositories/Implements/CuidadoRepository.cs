using Microsoft.EntityFrameworkCore;
using ZooManagerApi.Data;
using ZooManagerApi.Models;
using ZooManagerApi.Repositories.Interfaces;

namespace ZooManagerApi.Repositories.Implements;

public class CuidadoRepository : ICuidadoRepository
{
    public async Task<IEnumerable<Cuidado>> GetAllByUserIdAsync(int userId)
    {
        return await _context.Cuidados
            .Include(c => c.Animal) 
            .Where(c => c.Animal!.UsuarioId == userId) 
            .ToListAsync();
    }
    private readonly ZooContext _context;
    public CuidadoRepository(ZooContext context) => _context = context;

    public async Task<IEnumerable<Cuidado>> GetAllAsync()
    {
        return await _context.Cuidados.Include(c => c.Animal).ToListAsync();
    }

    public async Task<Cuidado?> GetByIdAsync(int id)
    {
        return await _context.Cuidados.Include(c => c.Animal).FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Cuidado> CreateAsync(Cuidado cuidado)
    {
        _context.Cuidados.Add(cuidado);
        await _context.SaveChangesAsync();
        return cuidado;
    }

    public async Task UpdateAsync(Cuidado cuidado)
    {
        _context.Entry(cuidado).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Cuidado cuidado)
    {
        _context.Cuidados.Remove(cuidado);
        await _context.SaveChangesAsync();
    }
    
    public async Task<bool> ExistsAsync(int id) => await _context.Cuidados.AnyAsync(e => e.Id == id);
}