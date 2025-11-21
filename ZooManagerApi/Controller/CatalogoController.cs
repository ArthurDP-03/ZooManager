using Microsoft.AspNetCore.Mvc;
using ZooManagerApi.Repositories.Interfaces;

namespace ZooManagerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CatalogosController : ControllerBase
{
    private readonly ICatalogoRepository _repo;
    public CatalogosController(ICatalogoRepository repo) => _repo = repo;

    [HttpGet("especies")]
    public async Task<IActionResult> GetEspecies() => Ok(await _repo.GetEspeciesAsync());

    [HttpGet("habitats")]
    public async Task<IActionResult> GetHabitats() => Ok(await _repo.GetHabitatsAsync());
}