using Microsoft.EntityFrameworkCore;
using ZooManagerApi.Models;

namespace ZooManagerApi.Data;

public class ZooContext : DbContext
{
    public ZooContext(DbContextOptions<ZooContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Animal> Animais { get; set; }
    public DbSet<Cuidado> Cuidados { get; set; }
    public DbSet<Especie> Especies { get; set; } 
    public DbSet<Habitat> Habitats { get; set; } 

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>()
            .HasMany(u => u.Animais)      
            .WithOne(a => a.Usuario)
            .HasForeignKey(a => a.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Animal>()
            .HasMany(a => a.Cuidados)
            .WithOne(c => c.Animal)
            .HasForeignKey(c => c.AnimalId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Especie>().HasData(
            new Especie { Id = 1, Nome = "Leão" },
            new Especie { Id = 2, Nome = "Elefante" },
            new Especie { Id = 3, Nome = "Girafa" },
            new Especie { Id = 4, Nome = "Pinguim" },
            new Especie { Id = 5, Nome = "Tigre" },
            new Especie { Id = 6, Nome = "Urso" },
            new Especie { Id = 7, Nome = "Macaco" },
            new Especie { Id = 8, Nome = "Zebra" }
        );

        modelBuilder.Entity<Habitat>().HasData(
            new Habitat { Id = 1, Nome = "Savana" },
            new Habitat { Id = 2, Nome = "Floresta Tropical" },
            new Habitat { Id = 3, Nome = "Polar / Gelo" },
            new Habitat { Id = 4, Nome = "Deserto" },
            new Habitat { Id = 5, Nome = "Oceano" },
            new Habitat { Id = 6, Nome = "Montanha" }
        );
    }
}