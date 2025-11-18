using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ZooManagerApi.Models;

public class Usuario
{
    public int Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(64)] 
    public string Senha { get; set; } = string.Empty;

    [JsonIgnore]
    public ICollection<Animal>? Animais { get; set; }
}