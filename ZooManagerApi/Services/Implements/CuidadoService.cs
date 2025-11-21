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

    public async Task<IEnumerable<CuidadoResponseDto>> GetAllAsync(int userId)
    {
        var cuidados = await _cuidadoRepo.GetAllByUserIdAsync(userId);
        return cuidados.Select(MapToDto);
    }

    public async Task<CuidadoResponseDto?> GetByIdAsync(int id, int userId)
    {
        var c = await _cuidadoRepo.GetByIdAsync(id);
        
        if (c == null || c.Animal?.UsuarioId != userId) 
            return null;

        return MapToDto(c);
    }

    public async Task<CuidadoResponseDto> CreateAsync(CuidadoDto dto, int userId)
    {
        var animal = await _animalRepo.GetByIdAsync(dto.AnimalId);
        
        if (animal == null) 
            throw new Exception("Animal não encontrado.");

        if (animal.UsuarioId != userId)
            throw new UnauthorizedAccessException("Este animal não pertence a você.");

        var cuidado = new Cuidado
        {
            Nome = dto.Nome,
            Descricao = dto.Descricao,
            Frequencia = dto.Frequencia,
            AnimalId = dto.AnimalId
        };

        var criado = await _cuidadoRepo.CreateAsync(cuidado);
        
        criado.Animal = animal;

        return MapToDto(criado);
    }

    public async Task UpdateAsync(int id, CuidadoDto dto, int userId)
    {
        var cuidado = await _cuidadoRepo.GetByIdAsync(id);
        
        if (cuidado == null) throw new Exception("Cuidado não encontrado");

        if (cuidado.Animal?.UsuarioId != userId)
            throw new UnauthorizedAccessException("Você não tem permissão para editar este cuidado.");

        cuidado.Nome = dto.Nome;
        cuidado.Descricao = dto.Descricao;
        cuidado.Frequencia = dto.Frequencia;
        await _cuidadoRepo.UpdateAsync(cuidado);
    }

    public async Task DeleteAsync(int id, int userId)
    {
        var cuidado = await _cuidadoRepo.GetByIdAsync(id);
        
        if (cuidado != null)
        {
            // 🔒 SEGURANÇA
            if (cuidado.Animal?.UsuarioId != userId)
                throw new UnauthorizedAccessException("Você não tem permissão para excluir este cuidado.");

            await _cuidadoRepo.DeleteAsync(cuidado);
        }
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