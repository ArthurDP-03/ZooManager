using Microsoft.EntityFrameworkCore;
using ZooManagerApi.Data;
using ZooManagerApi.Models;
using ZooManagerApi.Repositories.Interfaces;

namespace ZooManagerApi.Repositories.Implements;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly ZooContext _context;
    public UsuarioRepository(ZooContext context) => _context = context;

    public async Task<IEnumerable<Usuario>> GetAllAsync() => await _context.Usuarios.ToListAsync();
    
    public async Task<Usuario?> GetByIdAsync(int id) => await _context.Usuarios.FindAsync(id);
    
    public async Task<Usuario?> GetByEmailAsync(string email) => 
        await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<Usuario> CreateAsync(Usuario usuario)
    {
        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();
        return usuario;
    }

    public async Task UpdateAsync(Usuario usuario)
    {
        _context.Entry(usuario).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Usuario usuario)
    {
        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync();
    }
}