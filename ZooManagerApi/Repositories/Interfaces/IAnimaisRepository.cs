using ZooManagerApi.Models;

namespace ZooManagerApi.Repositories.Interfaces;

public interface IAnimalRepository
{
    Task<IEnumerable<Animal>> GetAllAsync();
    Task<Animal?> GetByIdAsync(int id);
    Task<Animal> CreateAsync(Animal animal);
    Task UpdateAsync(Animal animal);
    Task DeleteAsync(Animal animal);
    Task<bool> ExistsAsync(int id);
}