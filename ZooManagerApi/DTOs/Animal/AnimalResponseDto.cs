namespace ZooManagerApi.DTOs;

public class AnimalResponseDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public DateTime? DataNascimento { get; set; }
    
    public string Especie { get; set; } = string.Empty; 
    public int EspecieId { get; set; }
    
    public string Habitat { get; set; } = string.Empty; 
    public int HabitatId { get; set; } 

    public string? PaisOrigem { get; set; }
    public string NomeDono { get; set; } = string.Empty;
}