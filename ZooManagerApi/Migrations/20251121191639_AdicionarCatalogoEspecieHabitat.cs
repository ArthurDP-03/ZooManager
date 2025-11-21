using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ZooManagerApi.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarCatalogoEspecieHabitat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Habitat",
                table: "Animais");

            migrationBuilder.AddColumn<int>(
                name: "EspecieId",
                table: "Animais",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "HabitatId",
                table: "Animais",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Especies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Especies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Habitats",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Habitats", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Especies",
                columns: new[] { "Id", "Nome" },
                values: new object[,]
                {
                    { 1, "Leão" },
                    { 2, "Elefante" },
                    { 3, "Girafa" },
                    { 4, "Pinguim" },
                    { 5, "Tigre" },
                    { 6, "Urso" },
                    { 7, "Macaco" },
                    { 8, "Zebra" }
                });

            migrationBuilder.InsertData(
                table: "Habitats",
                columns: new[] { "Id", "Nome" },
                values: new object[,]
                {
                    { 1, "Savana" },
                    { 2, "Floresta Tropical" },
                    { 3, "Polar / Gelo" },
                    { 4, "Deserto" },
                    { 5, "Oceano" },
                    { 6, "Montanha" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Animais_EspecieId",
                table: "Animais",
                column: "EspecieId");

            migrationBuilder.CreateIndex(
                name: "IX_Animais_HabitatId",
                table: "Animais",
                column: "HabitatId");

            migrationBuilder.AddForeignKey(
                name: "FK_Animais_Especies_EspecieId",
                table: "Animais",
                column: "EspecieId",
                principalTable: "Especies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Animais_Habitats_HabitatId",
                table: "Animais",
                column: "HabitatId",
                principalTable: "Habitats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animais_Especies_EspecieId",
                table: "Animais");

            migrationBuilder.DropForeignKey(
                name: "FK_Animais_Habitats_HabitatId",
                table: "Animais");

            migrationBuilder.DropTable(
                name: "Especies");

            migrationBuilder.DropTable(
                name: "Habitats");

            migrationBuilder.DropIndex(
                name: "IX_Animais_EspecieId",
                table: "Animais");

            migrationBuilder.DropIndex(
                name: "IX_Animais_HabitatId",
                table: "Animais");

            migrationBuilder.DropColumn(
                name: "EspecieId",
                table: "Animais");

            migrationBuilder.DropColumn(
                name: "HabitatId",
                table: "Animais");

            migrationBuilder.AddColumn<string>(
                name: "Habitat",
                table: "Animais",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }
    }
}
