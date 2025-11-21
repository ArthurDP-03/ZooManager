using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using ZooManagerApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ZooContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; 
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true, 
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false, 
        ValidateAudience = false 
    };
});

// --- 3. SERVIÇOS PADRÃO (CONTROLLERS & CORS) ---
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// --- 4. CONFIGURAÇÃO DO SWAGGER (COM SUPORTE A JWT) 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ZooManagerApi", Version = "v1" });

    // Adiciona a definição de segurança (Botão Authorize)
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme() 
    { 
        Name = "Authorization", 
        Type = SecuritySchemeType.ApiKey, 
        Scheme = "Bearer", 
        BearerFormat = "JWT", 
        In = ParameterLocation.Header, 
        Description = "Insira o token JWT desta maneira: Bearer {seu token}" 
    }); 

    // Adiciona a exigência de segurança para as rotas
    c.AddSecurityRequirement(new OpenApiSecurityRequirement 
    { 
        { 
              new OpenApiSecurityScheme 
              { 
                  Reference = new OpenApiReference 
                  { 
                      Type = ReferenceType.SecurityScheme, 
                      Id = "Bearer" 
                  } 
              }, 
              new string[] {} 
        } 
    }); 
});

var app = builder.Build();

// --- PIPELINE (ORDEM DE EXECUÇÃO) ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

// ⭐ ATENÇÃO À ORDEM: Authentication ANTES de Authorization
app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();