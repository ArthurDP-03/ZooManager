using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ZooManagerApi.Models;

public class Animal
{
    public int Id { get; set; }

    [MaxLength(50)]
    public string? Nome { get; set; }

    public string? Descricao { get; set; }
    public DateTime? DataNascimento { get; set; }

    // --- RELACIONAMENTOS ---
    
    public int EspecieId { get; set; }
    [ForeignKey("EspecieId")]
    [JsonIgnore]
    public Especie? Especie { get; set; }

    public int HabitatId { get; set; }
    [ForeignKey("HabitatId")]
    [JsonIgnore]
    public Habitat? Habitat { get; set; }

    [MaxLength(50)]
    public string? PaisOrigem { get; set; }

    public int UsuarioId { get; set; }
    [JsonIgnore]
    [ForeignKey("UsuarioId")]
    public Usuario? Usuario { get; set; }

    [JsonIgnore]
    public ICollection<Cuidado>? Cuidados { get; set; }
}