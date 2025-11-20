namespace ZooManagerApi.DTOs;

public class CuidadoResponseDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public string Frequencia { get; set; } = string.Empty;
    public string NomeAnimal { get; set; } = string.Empty;
}