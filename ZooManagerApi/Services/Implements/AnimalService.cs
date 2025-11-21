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
        // 1. Valida se o dono existe
        var dono = await _usuarioRepo.GetByIdAsync(dto.UsuarioId);
        if (dono == null) throw new Exception("Usuário dono não encontrado.");

        // 2. Cria a entidade mapeando os IDs
        var animal = new Animal
        {
            Nome = dto.Nome,
            Descricao = dto.Descricao,
            DataNascimento = dto.DataNascimento,
            PaisOrigem = dto.PaisOrigem,
            UsuarioId = dto.UsuarioId,
            EspecieId = dto.EspecieId, // ID vindo do Select no Front
            HabitatId = dto.HabitatId  // ID vindo do Select no Front
        };

        // 3. Salva no banco
        var criado = await _animalRepo.CreateAsync(animal);
        
        // 4. Busca o animal completo (com Includes) para retornar os nomes corretos no DTO
        // (Sem isso, o retorno teria "Especie: null" na primeira resposta)
        var animalCompleto = await _animalRepo.GetByIdAsync(criado.Id);

        return MapToDto(animalCompleto ?? criado);
    }

    public async Task UpdateAsync(int id, AnimalDto dto)
    {
        var animal = await _animalRepo.GetByIdAsync(id);
        if (animal == null) throw new Exception("Animal não encontrado");

        // Atualiza os campos
        animal.Nome = dto.Nome;
        animal.Descricao = dto.Descricao;
        animal.DataNascimento = dto.DataNascimento;
        animal.PaisOrigem = dto.PaisOrigem;
        
        // Atualiza as FKs
        animal.EspecieId = dto.EspecieId;
        animal.HabitatId = dto.HabitatId;

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
            PaisOrigem = a.PaisOrigem,
            
            // Mapeia os nomes para exibição
            Especie = a.Especie?.Nome ?? "Não definida",
            EspecieId = a.EspecieId,
            
            Habitat = a.Habitat?.Nome ?? "Não definido",
            HabitatId = a.HabitatId,

            NomeDono = a.Usuario?.Nome ?? "Sem Dono"
        };
    }
}