using ZooManagerApi.DTOs;
using ZooManagerApi.Models;
using ZooManagerApi.Repositories.Interfaces;
using ZooManagerApi.Services.Interfaces;

namespace ZooManagerApi.Services.Implements;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _repository;

    public UsuarioService(IUsuarioRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Usuario>> GetAllAsync() => await _repository.GetAllAsync();
    
    public async Task<Usuario?> GetByIdAsync(int id) => await _repository.GetByIdAsync(id);

    public async Task<Usuario> CreateAsync(RegistroDto dto)
    {
        var existente = await _repository.GetByEmailAsync(dto.Email);
        if (existente != null) throw new Exception("Este e-mail já está em uso.");

        var usuario = new Usuario
        {
            Nome = dto.Nome,
            Email = dto.Email,
            Senha = BCrypt.Net.BCrypt.HashPassword(dto.Senha)
        };

        return await _repository.CreateAsync(usuario);
    }

    public async Task UpdateAsync(int id, Usuario usuario)
    {
        var userDb = await _repository.GetByIdAsync(id);
        if (userDb == null) throw new Exception("Usuário não encontrado");
        
        if (!string.IsNullOrEmpty(usuario.Senha) && !usuario.Senha.StartsWith("$2"))
        {
            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);
        }
        
        await _repository.UpdateAsync(usuario);
    }

    public async Task DeleteAsync(int id)
    {
        var usuario = await _repository.GetByIdAsync(id);
        if (usuario != null) await _repository.DeleteAsync(usuario);
    }
}