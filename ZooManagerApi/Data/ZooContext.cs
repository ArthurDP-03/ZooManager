using Microsoft.EntityFrameworkCore;
using ZooManagerApi.Models;

namespace ZooManagerApi.Data;

public class ZooContext : DbContext
{
    public ZooContext(DbContextOptions<ZooContext> options) : base(options)
    {
    }

    // Tabelas
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Animal> Animais { get; set; }
    public DbSet<Cuidado> Cuidados { get; set; }

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
    }
}