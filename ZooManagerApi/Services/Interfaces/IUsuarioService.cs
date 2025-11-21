using ZooManagerApi.DTOs;
using ZooManagerApi.Models;

namespace ZooManagerApi.Services.Interfaces;

public interface IUsuarioService
{
    Task<IEnumerable<Usuario>> GetAllAsync();
    Task<Usuario?> GetByIdAsync(int id);
    Task<Usuario> CreateAsync(RegistroDto dto);
    Task UpdateAsync(int id, Usuario usuario);
    Task DeleteAsync(int id);
}