using Microsoft.EntityFrameworkCore;
using ZooManagerApi.Data;
using ZooManagerApi.Models;
using ZooManagerApi.Repositories.Interfaces;

namespace ZooManagerApi.Repositories.Implements;

public class CatalogoRepository : ICatalogoRepository
{
    private readonly ZooContext _context;
    public CatalogoRepository(ZooContext context) => _context = context;

    public async Task<IEnumerable<Especie>> GetEspeciesAsync() 
        => await _context.Especies.OrderBy(e => e.Nome).ToListAsync();

    public async Task<IEnumerable<Habitat>> GetHabitatsAsync() 
        => await _context.Habitats.OrderBy(h => h.Nome).ToListAsync();
}