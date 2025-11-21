using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ZooManagerApi.Models;

public class Habitat
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Nome { get; set; } = string.Empty;

    [JsonIgnore]
    public ICollection<Animal>? Animais { get; set; }
}