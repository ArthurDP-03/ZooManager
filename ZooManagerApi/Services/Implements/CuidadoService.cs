using ZooManagerApi.DTOs;
using ZooManagerApi.Models;
using ZooManagerApi.Repositories.Interfaces;
using ZooManagerApi.Services.Interfaces;

namespace ZooManagerApi.Services.Implements;

public class CuidadoService : ICuidadoService
{
    private readonly ICuidadoRepository _cuidadoRepo;
    private readonly IAnimalRepository _animalRepo;

    public CuidadoService(ICuidadoRepository cuidadoRepo, IAnimalRepository animalRepo)
    {
        _cuidadoRepo = cuidadoRepo;
        _animalRepo = animalRepo;
    }

    public async Task<IEnumerable<CuidadoResponseDto>> GetAllAsync()
    {
        var cuidados = await _cuidadoRepo.GetAllAsync();
        return cuidados.Select(MapToDto);
    }

    public async Task<CuidadoResponseDto?> GetByIdAsync(int id)
    {
        var c = await _cuidadoRepo.GetByIdAsync(id);
        return c == null ? null : MapToDto(c);
    }

    public async Task<CuidadoResponseDto> CreateAsync(CuidadoDto dto)
    {
        var existeAnimal = await _animalRepo.ExistsAsync(dto.AnimalId);
        if (!existeAnimal) throw new Exception("Animal não encontrado.");

        var cuidado = new Cuidado
        {
            Nome = dto.Nome,
            Descricao = dto.Descricao,
            Frequencia = dto.Frequencia,
            AnimalId = dto.AnimalId
        };

        var criado = await _cuidadoRepo.CreateAsync(cuidado);
        
        // Busca o animal para retornar o nome correto no DTO
        var animal = await _animalRepo.GetByIdAsync(dto.AnimalId);
        criado.Animal = animal;

        return MapToDto(criado);
    }

    public async Task UpdateAsync(int id, CuidadoDto dto)
    {
        var cuidado = await _cuidadoRepo.GetByIdAsync(id);
        if (cuidado == null) throw new Exception("Cuidado não encontrado");

        cuidado.Nome = dto.Nome;
        cuidado.Descricao = dto.Descricao;
        cuidado.Frequencia = dto.Frequencia;

        await _cuidadoRepo.UpdateAsync(cuidado);
    }

    public async Task DeleteAsync(int id)
    {
        var cuidado = await _cuidadoRepo.GetByIdAsync(id);
        if (cuidado != null) await _cuidadoRepo.DeleteAsync(cuidado);
    }

    private static CuidadoResponseDto MapToDto(Cuidado c)
    {
        return new CuidadoResponseDto
        {
            Id = c.Id,
            Nome = c.Nome ?? "",
            Descricao = c.Descricao,
            Frequencia = c.Frequencia ?? "",
            NomeAnimal = c.Animal?.Nome ?? "Desconhecido"
        };
    }
}