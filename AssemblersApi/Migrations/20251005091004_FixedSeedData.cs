using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AssemblersApi.Migrations
{
    /// <inheritdoc />
    public partial class FixedSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("17f4bfd9-b1c2-4917-9f6f-ce7c360f4ba7"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("2db12c9c-19d6-4ed8-8745-f5ddc5fdbcc9"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("5071b1d1-2e4a-4ecf-955a-2ba4ccc4bb93"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("815854be-cba7-4e3c-b1c3-92fe21b1e1c5"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("e89cb5ed-4318-45f9-b5bf-799f08fd1919"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("da0ee40f-1978-4412-82ee-87fb0a66bc11"));

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "CreatedAt", "Description", "Image", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Electronic device assembly and repair", "electronics.jpg", "Electronics", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Furniture assembly and repair", "furniture.jpg", "Furniture", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { new Guid("33333333-3333-3333-3333-333333333333"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Home improvement and maintenance", "home-improvement.jpg", "Home Improvement", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { new Guid("44444444-4444-4444-4444-444444444444"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Computer assembly and repair", "computer-services.jpg", "Computer Services", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { new Guid("55555555-5555-5555-5555-555555555555"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Home appliance repair and maintenance", "appliance-repair.jpg", "Appliance Repair", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "CreatedAt", "Email", "Name", "Password", "Phone", "ProfileImage", "Role", "UpdatedAt" },
                values: new object[] { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), null, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "john@example.com", "John Doe", "hashedpassword", null, null, "customer", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"));

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "CreatedAt", "Description", "Image", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("17f4bfd9-b1c2-4917-9f6f-ce7c360f4ba7"), new DateTime(2025, 10, 5, 9, 9, 51, 352, DateTimeKind.Utc).AddTicks(8160), "Furniture assembly and repair", "furniture.jpg", "Furniture", new DateTime(2025, 10, 5, 9, 9, 51, 352, DateTimeKind.Utc).AddTicks(8160) },
                    { new Guid("2db12c9c-19d6-4ed8-8745-f5ddc5fdbcc9"), new DateTime(2025, 10, 5, 9, 9, 51, 352, DateTimeKind.Utc).AddTicks(8180), "Computer assembly and repair", "computer-services.jpg", "Computer Services", new DateTime(2025, 10, 5, 9, 9, 51, 352, DateTimeKind.Utc).AddTicks(8180) },
                    { new Guid("5071b1d1-2e4a-4ecf-955a-2ba4ccc4bb93"), new DateTime(2025, 10, 5, 9, 9, 51, 352, DateTimeKind.Utc).AddTicks(8180), "Home appliance repair and maintenance", "appliance-repair.jpg", "Appliance Repair", new DateTime(2025, 10, 5, 9, 9, 51, 352, DateTimeKind.Utc).AddTicks(8180) },
                    { new Guid("815854be-cba7-4e3c-b1c3-92fe21b1e1c5"), new DateTime(2025, 10, 5, 9, 9, 51, 352, DateTimeKind.Utc).AddTicks(8170), "Home improvement and maintenance", "home-improvement.jpg", "Home Improvement", new DateTime(2025, 10, 5, 9, 9, 51, 352, DateTimeKind.Utc).AddTicks(8170) },
                    { new Guid("e89cb5ed-4318-45f9-b5bf-799f08fd1919"), new DateTime(2025, 10, 5, 9, 9, 51, 352, DateTimeKind.Utc).AddTicks(7520), "Electronic device assembly and repair", "electronics.jpg", "Electronics", new DateTime(2025, 10, 5, 9, 9, 51, 352, DateTimeKind.Utc).AddTicks(7520) }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "CreatedAt", "Email", "Name", "Password", "Phone", "ProfileImage", "Role", "UpdatedAt" },
                values: new object[] { new Guid("da0ee40f-1978-4412-82ee-87fb0a66bc11"), null, new DateTime(2025, 10, 5, 9, 9, 51, 353, DateTimeKind.Utc).AddTicks(2530), "john@example.com", "John Doe", "hashedpassword", null, null, "customer", new DateTime(2025, 10, 5, 9, 9, 51, 353, DateTimeKind.Utc).AddTicks(2660) });
        }
    }
}
