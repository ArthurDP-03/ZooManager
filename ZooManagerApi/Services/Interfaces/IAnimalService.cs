using ZooManagerApi.DTOs;

namespace ZooManagerApi.Services.Interfaces;

public interface IAnimalService
{
    Task<IEnumerable<AnimalResponseDto>> GetAllAsync(int userId);
  
    Task<AnimalResponseDto?> GetByIdAsync(int id, int userId);
    
    Task<AnimalResponseDto> CreateAsync(AnimalDto dto);
    
    Task UpdateAsync(int id, AnimalDto dto, int userId);
    Task DeleteAsync(int id, int userId);
}