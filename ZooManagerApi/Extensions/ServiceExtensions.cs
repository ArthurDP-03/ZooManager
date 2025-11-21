using ZooManagerApi.Configuration;
using ZooManagerApi.Repositories.Implements;
using ZooManagerApi.Repositories.Interfaces;
using ZooManagerApi.Services.Implements;
using ZooManagerApi.Services.Interfaces;

namespace ZooManagerApi.Extensions;

public static class ServiceExtensions
{
    public static void AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtSettings>(configuration.GetSection("Jwt"));

        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IAnimalRepository, AnimalRepository>();
        services.AddScoped<ICuidadoRepository, CuidadoRepository>();

        services.AddScoped<ICatalogoRepository, CatalogoRepository>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUsuarioService, UsuarioService>();
        services.AddScoped<IAnimalService, AnimalService>();
        services.AddScoped<ICuidadoService, CuidadoService>();
    }
}