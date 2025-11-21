using ZooManagerApi.Models;

namespace ZooManagerApi.Repositories.Interfaces;

public interface ICuidadoRepository
{
    Task<IEnumerable<Cuidado>> GetAllByUserIdAsync(int userId);
    Task<IEnumerable<Cuidado>> GetAllAsync();
    Task<Cuidado?> GetByIdAsync(int id);
    Task<Cuidado> CreateAsync(Cuidado cuidado);
    Task UpdateAsync(Cuidado cuidado);
    Task DeleteAsync(Cuidado cuidado);
    Task<bool> ExistsAsync(int id);
}