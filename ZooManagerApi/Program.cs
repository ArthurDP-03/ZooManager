using Microsoft.EntityFrameworkCore;
using ZooManagerApi.Data;

var builder = WebApplication.CreateBuilder(args);

// --- CONFIGURAÇÃO (ANTES DO BUILD) ---

// 1. Adicionar Controllers
builder.Services.AddControllers();

// 2. Adicionar Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3. ⭐ AQUI ESTÁ A MÁGICA DO BANCO ⭐
// Registra o ZooContext usando a conexão que colocamos no appsettings.json
builder.Services.AddDbContext<ZooContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// --- FIM DA CONFIGURAÇÃO ---

var app = builder.Build();

// --- USO DO APP (DEPOIS DO BUILD) ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();