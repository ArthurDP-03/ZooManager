using System.ComponentModel.DataAnnotations;

namespace ZooManagerApi.DTOs;

public class CuidadoDto
{
    [Required] [MaxLength(50)] public string Nome { get; set; } = string.Empty;
    [MaxLength(50)] public string? Descricao { get; set; }
    [Required] [MaxLength(50)] public string Frequencia { get; set; } = string.Empty;
    [Required] public int AnimalId { get; set; } // ID do Animal
}