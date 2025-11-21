using ZooManagerApi.Models;

namespace ZooManagerApi.Repositories.Interfaces;

public interface ICatalogoRepository
{
    Task<IEnumerable<Especie>> GetEspeciesAsync();
    Task<IEnumerable<Habitat>> GetHabitatsAsync();
}