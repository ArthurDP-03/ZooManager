using Microsoft.EntityFrameworkCore;
using ZooManagerApi.Data;
using ZooManagerApi.Models;
using ZooManagerApi.Repositories.Interfaces;

namespace ZooManagerApi.Repositories.Implements;

public class AnimalRepository : IAnimalRepository
{
    private readonly ZooContext _context;
    public AnimalRepository(ZooContext context) => _context = context;

    public async Task<IEnumerable<Animal>> GetAllAsync()
    {
        // Include Usuario para pegar o nome do dono
        return await _context.Animais.Include(a => a.Usuario).ToListAsync();
    }

    public async Task<Animal?> GetByIdAsync(int id)
    {
        return await _context.Animais.Include(a => a.Usuario).FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Animal> CreateAsync(Animal animal)
    {
        _context.Animais.Add(animal);
        await _context.SaveChangesAsync();
        return animal;
    }

    public async Task UpdateAsync(Animal animal)
    {
        _context.Entry(animal).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Animal animal)
    {
        _context.Animais.Remove(animal);
        await _context.SaveChangesAsync();
    }
    
    public async Task<bool> ExistsAsync(int id) => await _context.Animais.AnyAsync(e => e.Id == id);
}