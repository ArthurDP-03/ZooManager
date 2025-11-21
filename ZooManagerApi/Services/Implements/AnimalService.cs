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

    public async Task<IEnumerable<AnimalResponseDto>> GetAllAsync(int userId)
    {
        // Chama o método do repositório que filtra por User ID
        // (Certifique-se de ter adicionado o GetAllByUserIdAsync no Repository conforme passo anterior)
        var animais = await _animalRepo.GetAllByUserIdAsync(userId);
        return animais.Select(MapToDto);
    }

    public async Task<AnimalResponseDto?> GetByIdAsync(int id, int userId)
    {
        var animal = await _animalRepo.GetByIdAsync(id);
        
        if (animal == null || animal.UsuarioId != userId) 
            return null;

        return MapToDto(animal);
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
            PaisOrigem = dto.PaisOrigem,
            UsuarioId = dto.UsuarioId,
            EspecieId = dto.EspecieId,
            HabitatId = dto.HabitatId
        };

        var criado = await _animalRepo.CreateAsync(animal);
        var animalCompleto = await _animalRepo.GetByIdAsync(criado.Id);
        return MapToDto(animalCompleto ?? criado);
    }

    public async Task UpdateAsync(int id, AnimalDto dto, int userId)
    {
        var animal = await _animalRepo.GetByIdAsync(id);
        
        if (animal == null) throw new Exception("Animal não encontrado");
        if (animal.UsuarioId != userId) 
            throw new UnauthorizedAccessException("Você não tem permissão para editar este animal.");

        // Atualiza dados
        animal.Nome = dto.Nome;
        animal.Descricao = dto.Descricao;
        animal.DataNascimento = dto.DataNascimento;
        animal.PaisOrigem = dto.PaisOrigem;
        animal.EspecieId = dto.EspecieId;
        animal.HabitatId = dto.HabitatId;

        await _animalRepo.UpdateAsync(animal);
    }

    public async Task DeleteAsync(int id, int userId)
    {
        var animal = await _animalRepo.GetByIdAsync(id);
        
        if (animal != null)
        {
            if (animal.UsuarioId != userId) 
                throw new UnauthorizedAccessException("Você não tem permissão para excluir este animal.");

            await _animalRepo.DeleteAsync(animal);
        }
    }

    private static AnimalResponseDto MapToDto(Animal a)
    {
        return new AnimalResponseDto
        {
            Id = a.Id,
            Nome = a.Nome ?? "",
            Descricao = a.Descricao,
            DataNascimento = a.DataNascimento,
            PaisOrigem = a.PaisOrigem,
            NomeDono = a.Usuario?.Nome ?? "Sem Dono",
            
            Especie = a.Especie?.Nome ?? "N/A",
            EspecieId = a.EspecieId,
            
            Habitat = a.Habitat?.Nome ?? "N/A",
            HabitatId = a.HabitatId
        };
    }
}