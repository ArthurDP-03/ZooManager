using ZooManagerApi.DTOs;
using ZooManagerApi.Models;

namespace ZooManagerApi.Services.Interfaces;

public interface ICuidadoService
{
    Task<IEnumerable<CuidadoResponseDto>> GetAllAsync();
    Task<CuidadoResponseDto?> GetByIdAsync(int id);
    Task<CuidadoResponseDto> CreateAsync(CuidadoDto dto);
    Task UpdateAsync(int id, CuidadoDto dto);
    Task DeleteAsync(int id);
}