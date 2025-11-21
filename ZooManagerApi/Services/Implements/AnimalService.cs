using ZooManagerApi.DTOs;
using ZooManagerApi.Models;
using ZooManagerApi.Repositories.Interfaces;
using ZooManagerApi.Services.Interfaces;

namespace ZooManagerApi.Services.Implements;

public class AnimalService : IAnimalService
{
    private readonly IAnimalRepository _animalRepo;
    private readonly IUsuarioRepository _usuarioRepo;

    public AnimalService(IAnimalRepository animalRepo, IUsuarioRepository usuarioRepo)
    {
        _animalRepo = animalRepo;
        _usuarioRepo = usuarioRepo;
    }

    public async Task<IEnumerable<AnimalResponseDto>> GetAllAsync()
    {
        var animais = await _animalRepo.GetAllAsync();
        return animais.Select(MapToDto);
    }

    public async Task<AnimalResponseDto?> GetByIdAsync(int id)
    {
        var animal = await _animalRepo.GetByIdAsync(id);
        return animal == null ? null : MapToDto(animal);
    }

    public async Task<AnimalResponseDto> CreateAsync(AnimalDto dto)
    {
        var dono = await _usuarioRepo.GetByIdAsync(dto.UsuarioId);
        if (dono == null) throw new Exception("Usuário dono não encontrado.");

        var animal = new Animal
        {
            Nome = dto.Nome,
            Descricao = dto.Descricao,
            DataNascimento = dto.DataNascimento,
            Habitat = dto.Habitat,
            PaisOrigem = dto.PaisOrigem,
            UsuarioId = dto.UsuarioId
        };

        var criado = await _animalRepo.CreateAsync(animal);
        
        // Recarrega para garantir que temos os dados do dono preenchidos se necessário
        criado.Usuario = dono;
        return MapToDto(criado);
    }

    public async Task UpdateAsync(int id, AnimalDto dto)
    {
        var animal = await _animalRepo.GetByIdAsync(id);
        if (animal == null) throw new Exception("Animal não encontrado");

        animal.Nome = dto.Nome;
        animal.Descricao = dto.Descricao;
        animal.DataNascimento = dto.DataNascimento;
        animal.Habitat = dto.Habitat;
        animal.PaisOrigem = dto.PaisOrigem;

        await _animalRepo.UpdateAsync(animal);
    }

    public async Task DeleteAsync(int id)
    {
        var animal = await _animalRepo.GetByIdAsync(id);
        if (animal != null) await _animalRepo.DeleteAsync(animal);
    }

    private static AnimalResponseDto MapToDto(Animal a)
    {
        return new AnimalResponseDto
        {
            Id = a.Id,
            Nome = a.Nome ?? "",
            Descricao = a.Descricao,
            DataNascimento = a.DataNascimento,
            Habitat = a.Habitat,
            PaisOrigem = a.PaisOrigem,
            NomeDono = a.Usuario?.Nome ?? "Sem Dono"
        };
    }
}