using System.ComponentModel.DataAnnotations;

namespace ZooManagerApi.DTOs;

public class AnimalDto
{
    [Required] [MaxLength(50)] public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public DateTime? DataNascimento { get; set; }
    [MaxLength(50)] public string? Habitat { get; set; }
    [MaxLength(50)] public string? PaisOrigem { get; set; }
    [Required] public int UsuarioId { get; set; } // ID do Dono
}