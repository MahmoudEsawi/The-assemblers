using Microsoft.EntityFrameworkCore;
using AssemblersApi.Domain.Entities;

namespace AssemblersApi.Data;

public class AssemblersDbContext : DbContext
{
    public AssemblersDbContext(DbContextOptions<AssemblersDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Assembler> Assemblers { get; set; }
    public DbSet<DayAvailability> DayAvailabilities { get; set; }
    public DbSet<Service> Services { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Review> Reviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Configure Assembler entity
        modelBuilder.Entity<Assembler>(entity =>
        {
            entity.HasOne(e => e.User)
                  .WithMany(u => u.AssemblerProfiles)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure DayAvailability entity
        modelBuilder.Entity<DayAvailability>(entity =>
        {
            entity.HasOne(e => e.Assembler)
                  .WithMany(a => a.Availability)
                  .HasForeignKey(e => e.AssemblerId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Service entity
        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasOne(e => e.Category)
                  .WithMany(c => c.Services)
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(e => e.Assembler)
                  .WithMany(a => a.Services)
                  .HasForeignKey(e => e.AssemblerId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Booking entity
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasOne(e => e.Customer)
                  .WithMany(u => u.CustomerBookings)
                  .HasForeignKey(e => e.CustomerId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(e => e.Assembler)
                  .WithMany(a => a.AssemblerBookings)
                  .HasForeignKey(e => e.AssemblerId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(e => e.Service)
                  .WithMany(s => s.Bookings)
                  .HasForeignKey(e => e.ServiceId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Review entity
        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasOne(e => e.Customer)
                  .WithMany(u => u.CustomerReviews)
                  .HasForeignKey(e => e.CustomerId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(e => e.Assembler)
                  .WithMany(a => a.AssemblerReviews)
                  .HasForeignKey(e => e.AssemblerId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(e => e.Booking)
                  .WithMany(b => b.Reviews)
                  .HasForeignKey(e => e.BookingId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed Categories
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Furniture Assembly", Description = "Professional furniture assembly services", Image = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Category { Id = 2, Name = "Electronics Setup", Description = "Electronics installation and setup services", Image = "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Category { Id = 3, Name = "Home Improvement", Description = "General home improvement and repair services", Image = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Category { Id = 4, Name = "Computer Services", Description = "Computer assembly, repair, and setup services", Image = "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Category { Id = 5, Name = "Smart Home", Description = "Smart home device installation and setup", Image = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) }
        );

        // Seed Users
        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Name = "John Smith", Email = "john@example.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1234567890", Address = "123 Main St", ProfileImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", Role = "Customer", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new User { Id = 2, Name = "Sarah Johnson", Email = "sarah@example.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1234567891", Address = "456 Oak Ave", ProfileImage = "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face", Role = "Customer", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new User { Id = 3, Name = "Mike Wilson", Email = "mike@example.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1234567892", Address = "789 Pine Rd", ProfileImage = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", Role = "Assembler", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new User { Id = 4, Name = "Lisa Brown", Email = "lisa@example.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1234567893", Address = "321 Elm St", ProfileImage = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", Role = "Assembler", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new User { Id = 5, Name = "David Lee", Email = "david@example.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1234567894", Address = "654 Maple Dr", ProfileImage = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", Role = "Assembler", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) }
        );

        // Seed Assemblers
        modelBuilder.Entity<Assembler>().HasData(
            new Assembler { Id = 1, UserId = 3, Specialization = "Furniture Assembly", Description = "Expert in IKEA and other furniture assembly", Location = "New York, NY", CoverImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", AverageRating = 4.8m, IsVerified = true, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Assembler { Id = 2, UserId = 4, Specialization = "Electronics Setup", Description = "Professional electronics installation and setup", Location = "Los Angeles, CA", CoverImage = "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop", AverageRating = 4.9m, IsVerified = true, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Assembler { Id = 3, UserId = 5, Specialization = "Computer Assembly", Description = "Custom PC building and computer repair", Location = "Chicago, IL", CoverImage = "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop", AverageRating = 4.7m, IsVerified = true, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) }
        );

        // Seed Day Availabilities
        var availabilities = new List<DayAvailability>();
        for (int assemblerId = 1; assemblerId <= 3; assemblerId++)
        {
            for (int day = 1; day <= 5; day++) // Monday to Friday
            {
                availabilities.Add(new DayAvailability
                {
                    Id = (assemblerId - 1) * 5 + day,
                    AssemblerId = assemblerId,
                    DayOfWeek = day,
                    Start = TimeSpan.FromHours(9),
                    End = TimeSpan.FromHours(17),
                    Available = true,
                    CreatedAt = new DateTime(2024, 1, 1),
                    UpdatedAt = new DateTime(2024, 1, 1)
                });
            }
        }
        modelBuilder.Entity<DayAvailability>().HasData(availabilities.ToArray());

        // Seed Services
        modelBuilder.Entity<Service>().HasData(
            new Service { Id = 1, CategoryId = 1, AssemblerId = 1, Name = "IKEA Furniture Assembly", Description = "Professional IKEA furniture assembly service", Price = 25.00m, ImageUrl = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", AverageRating = 4.8m, ReviewCount = 15, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 2, CategoryId = 1, AssemblerId = 1, Name = "Office Furniture Setup", Description = "Office furniture assembly and setup", Price = 30.00m, ImageUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", AverageRating = 4.9m, ReviewCount = 8, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 3, CategoryId = 2, AssemblerId = 2, Name = "TV Mounting", Description = "Professional TV mounting and setup", Price = 50.00m, ImageUrl = "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop", AverageRating = 4.9m, ReviewCount = 12, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 4, CategoryId = 2, AssemblerId = 2, Name = "Home Theater Setup", Description = "Complete home theater system installation", Price = 75.00m, ImageUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", AverageRating = 4.7m, ReviewCount = 6, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 5, CategoryId = 4, AssemblerId = 3, Name = "Custom PC Build", Description = "Custom gaming PC assembly and setup", Price = 100.00m, ImageUrl = "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop", AverageRating = 4.8m, ReviewCount = 20, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 6, CategoryId = 4, AssemblerId = 3, Name = "Laptop Repair", Description = "Professional laptop repair and maintenance", Price = 40.00m, ImageUrl = "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop", AverageRating = 4.6m, ReviewCount = 10, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 7, CategoryId = 5, AssemblerId = 2, Name = "Smart Home Setup", Description = "Smart home device installation and configuration", Price = 60.00m, ImageUrl = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", AverageRating = 4.9m, ReviewCount = 14, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 8, CategoryId = 3, AssemblerId = 1, Name = "General Assembly", Description = "General assembly and installation services", Price = 35.00m, ImageUrl = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop", AverageRating = 4.5m, ReviewCount = 7, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) }
        );
    }
}