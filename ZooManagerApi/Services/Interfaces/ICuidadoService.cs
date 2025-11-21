using ZooManagerApi.DTOs;

namespace ZooManagerApi.Services.Interfaces;

public interface ICuidadoService
{
    Task<IEnumerable<CuidadoResponseDto>> GetAllAsync(int userId);
    Task<CuidadoResponseDto?> GetByIdAsync(int id, int userId);
    Task<CuidadoResponseDto> CreateAsync(CuidadoDto dto, int userId);
    Task UpdateAsync(int id, CuidadoDto dto, int userId);
    Task DeleteAsync(int id, int userId);
}