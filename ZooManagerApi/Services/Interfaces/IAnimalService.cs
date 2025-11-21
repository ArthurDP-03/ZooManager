using ZooManagerApi.DTOs;
using ZooManagerApi.Models;

namespace ZooManagerApi.Services.Interfaces;

public interface IAnimalService
{
    Task<IEnumerable<AnimalResponseDto>> GetAllAsync();
    Task<AnimalResponseDto?> GetByIdAsync(int id);
    Task<AnimalResponseDto> CreateAsync(AnimalDto dto);
    Task UpdateAsync(int id, AnimalDto dto);
    Task DeleteAsync(int id);
}