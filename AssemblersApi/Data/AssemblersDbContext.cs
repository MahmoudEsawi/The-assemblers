using Microsoft.EntityFrameworkCore;
using AssemblersApi.Models;

namespace AssemblersApi.Data
{
    public class AssemblersDbContext : DbContext
    {
        public AssemblersDbContext(DbContextOptions<AssemblersDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Assembler> Assemblers { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<DayAvailability> DayAvailabilities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Role).HasDefaultValue("customer");
            });

            // Configure Assembler entity
            modelBuilder.Entity<Assembler>(entity =>
            {
                entity.HasOne(a => a.User)
                    .WithMany(u => u.AssemblerProfiles)
                    .HasForeignKey(a => a.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Service entity
            modelBuilder.Entity<Service>(entity =>
            {
                entity.HasOne(s => s.Category)
                    .WithMany(c => c.Services)
                    .HasForeignKey(s => s.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(s => s.Assembler)
                    .WithMany(a => a.Services)
                    .HasForeignKey(s => s.AssemblerId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Booking entity
            modelBuilder.Entity<Booking>(entity =>
            {
                entity.HasOne(b => b.Customer)
                    .WithMany(u => u.CustomerBookings)
                    .HasForeignKey(b => b.CustomerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(b => b.Assembler)
                    .WithMany(a => a.Bookings)
                    .HasForeignKey(b => b.AssemblerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(b => b.Service)
                    .WithMany(s => s.Bookings)
                    .HasForeignKey(b => b.ServiceId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Review entity
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasOne(r => r.Customer)
                    .WithMany(u => u.ReviewsGiven)
                    .HasForeignKey(r => r.CustomerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(r => r.Assembler)
                    .WithMany(a => a.Reviews)
                    .HasForeignKey(r => r.AssemblerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(r => r.Booking)
                    .WithMany(b => b.Reviews)
                    .HasForeignKey(r => r.BookingId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Configure DayAvailability entity
            modelBuilder.Entity<DayAvailability>(entity =>
            {
                entity.HasOne(da => da.Assembler)
                    .WithMany(a => a.Availability)
                    .HasForeignKey(da => da.AssemblerId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Categories with static GUIDs
            var category1Id = new Guid("11111111-1111-1111-1111-111111111111");
            var category2Id = new Guid("22222222-2222-2222-2222-222222222222");
            var category3Id = new Guid("33333333-3333-3333-3333-333333333333");
            var category4Id = new Guid("44444444-4444-4444-4444-444444444444");
            var category5Id = new Guid("55555555-5555-5555-5555-555555555555");

            var categories = new List<Category>
            {
                new Category { Id = category1Id, Name = "Electronics", Description = "Electronic device assembly and repair", Image = "electronics.jpg", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
                new Category { Id = category2Id, Name = "Furniture", Description = "Furniture assembly and repair", Image = "furniture.jpg", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
                new Category { Id = category3Id, Name = "Home Improvement", Description = "Home improvement and maintenance", Image = "home-improvement.jpg", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
                new Category { Id = category4Id, Name = "Computer Services", Description = "Computer assembly and repair", Image = "computer-services.jpg", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
                new Category { Id = category5Id, Name = "Appliance Repair", Description = "Home appliance repair and maintenance", Image = "appliance-repair.jpg", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) }
            };

            modelBuilder.Entity<Category>().HasData(categories);

            // Seed a test user with static GUID
            var testUserId = new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
            var testUser = new User
            {
                Id = testUserId,
                Name = "John Doe",
                Email = "john@example.com",
                Password = "hashedpassword", // In real app, this should be hashed
                Role = "customer",
                CreatedAt = new DateTime(2024, 1, 1),
                UpdatedAt = new DateTime(2024, 1, 1)
            };

            modelBuilder.Entity<User>().HasData(testUser);
        }
    }
}
