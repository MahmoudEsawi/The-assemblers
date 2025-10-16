using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AssemblersApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBookingStatusToEnum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // First, add a temporary column
            migrationBuilder.AddColumn<int>(
                name: "StatusTemp",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            // Convert string values to enum values
            migrationBuilder.Sql(@"
                UPDATE [Bookings] 
                SET [StatusTemp] = CASE 
                    WHEN [Status] = 'Pending' THEN 0
                    WHEN [Status] = 'Confirmed' THEN 1
                    WHEN [Status] = 'InProgress' THEN 2
                    WHEN [Status] = 'Completed' THEN 3
                    WHEN [Status] = 'Cancelled' THEN 4
                    WHEN [Status] = 'Rejected' THEN 5
                    ELSE 0
                END");

            // Drop the old column
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Bookings");

            // Rename the temporary column
            migrationBuilder.RenameColumn(
                name: "StatusTemp",
                table: "Bookings",
                newName: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Add back the string column
            migrationBuilder.AddColumn<string>(
                name: "StatusString",
                table: "Bookings",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Pending");

            // Convert enum values back to strings
            migrationBuilder.Sql(@"
                UPDATE [Bookings] 
                SET [StatusString] = CASE 
                    WHEN [Status] = 0 THEN 'Pending'
                    WHEN [Status] = 1 THEN 'Confirmed'
                    WHEN [Status] = 2 THEN 'InProgress'
                    WHEN [Status] = 3 THEN 'Completed'
                    WHEN [Status] = 4 THEN 'Cancelled'
                    WHEN [Status] = 5 THEN 'Rejected'
                    ELSE 'Pending'
                END");

            // Drop the int column
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Bookings");

            // Rename the string column
            migrationBuilder.RenameColumn(
                name: "StatusString",
                table: "Bookings",
                newName: "Status");
        }
    }
}
