using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ZooManagerApi.Models;

public class Cuidado
{
    public int Id { get; set; }

    [MaxLength(50)]
    public string? Nome { get; set; }

    [MaxLength(50)]
    public string? Descricao { get; set; }

    [MaxLength(50)]
    public string? Frequencia { get; set; }

    // --- Chave Estrangeira para Animal ---
    public int AnimalId { get; set; } // fk_Animal_id

    [JsonIgnore]
    [ForeignKey("AnimalId")]
    public Animal? Animal { get; set; }
}