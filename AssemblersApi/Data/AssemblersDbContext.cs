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
            
            entity.Property(e => e.AverageRating)
                  .HasPrecision(3, 2);
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
            
            entity.Property(e => e.AverageRating)
                  .HasPrecision(3, 2);
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
        // Seed Categories with comprehensive real data
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Furniture Assembly", Description = "Professional furniture assembly services for IKEA, Wayfair, and other brands", Image = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Category { Id = 2, Name = "Electronics Setup", Description = "TV mounting, home theater installation, and electronics setup", Image = "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Category { Id = 3, Name = "Home Improvement", Description = "General home improvement, repair, and installation services", Image = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Category { Id = 4, Name = "Computer Services", Description = "Custom PC building, laptop repair, and computer setup", Image = "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Category { Id = 5, Name = "Smart Home", Description = "Smart home device installation, configuration, and automation", Image = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Category { Id = 6, Name = "Appliance Installation", Description = "Dishwasher, washing machine, dryer, and appliance installation", Image = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Category { Id = 7, Name = "Outdoor Equipment", Description = "Patio furniture, grills, and outdoor equipment assembly", Image = "https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Category { Id = 8, Name = "Office Setup", Description = "Office furniture, equipment, and workspace organization", Image = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) }
        );

        // Seed Users with comprehensive real data
        modelBuilder.Entity<User>().HasData(
            // Customers
            new User { Id = 1, Name = "John Smith", Email = "john.smith@email.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1-555-0123", Address = "123 Main Street, New York, NY 10001", ProfileImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", Role = "Customer", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new User { Id = 2, Name = "Sarah Johnson", Email = "sarah.johnson@email.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1-555-0124", Address = "456 Oak Avenue, Los Angeles, CA 90210", ProfileImage = "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face", Role = "Customer", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new User { Id = 3, Name = "Michael Brown", Email = "michael.brown@email.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1-555-0125", Address = "789 Pine Road, Chicago, IL 60601", ProfileImage = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", Role = "Customer", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new User { Id = 4, Name = "Emily Davis", Email = "emily.davis@email.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1-555-0126", Address = "321 Elm Street, Houston, TX 77001", ProfileImage = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", Role = "Customer", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new User { Id = 5, Name = "David Wilson", Email = "david.wilson@email.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1-555-0127", Address = "654 Maple Drive, Phoenix, AZ 85001", ProfileImage = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", Role = "Customer", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            
            // Assemblers
            new User { Id = 6, Name = "Mike Rodriguez", Email = "mike.rodriguez@assemblers.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1-555-0201", Address = "100 Assembly Lane, New York, NY 10002", ProfileImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", Role = "Assembler", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new User { Id = 7, Name = "Lisa Chen", Email = "lisa.chen@assemblers.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1-555-0202", Address = "200 Tech Street, Los Angeles, CA 90211", ProfileImage = "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face", Role = "Assembler", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new User { Id = 8, Name = "James Thompson", Email = "james.thompson@assemblers.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1-555-0203", Address = "300 Build Avenue, Chicago, IL 60602", ProfileImage = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", Role = "Assembler", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new User { Id = 9, Name = "Maria Garcia", Email = "maria.garcia@assemblers.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1-555-0204", Address = "400 Install Road, Houston, TX 77002", ProfileImage = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", Role = "Assembler", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new User { Id = 10, Name = "Robert Lee", Email = "robert.lee@assemblers.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1-555-0205", Address = "500 Setup Boulevard, Phoenix, AZ 85002", ProfileImage = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", Role = "Assembler", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new User { Id = 11, Name = "Jennifer Martinez", Email = "jennifer.martinez@assemblers.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1-555-0206", Address = "600 Fix Street, Miami, FL 33101", ProfileImage = "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face", Role = "Assembler", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new User { Id = 12, Name = "Kevin Anderson", Email = "kevin.anderson@assemblers.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1-555-0207", Address = "700 Repair Lane, Seattle, WA 98101", ProfileImage = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", Role = "Assembler", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new User { Id = 13, Name = "Amanda Taylor", Email = "amanda.taylor@assemblers.com", Password = "75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=", Phone = "+1-555-0208", Address = "800 Service Drive, Boston, MA 02101", ProfileImage = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", Role = "Assembler", CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) }
        );

        // Seed Assemblers with comprehensive real data
        modelBuilder.Entity<Assembler>().HasData(
            new Assembler { Id = 1, UserId = 6, Specialization = "Furniture Assembly", Description = "Expert in IKEA, Wayfair, and other furniture assembly. 5+ years experience with complex furniture builds.", Location = "New York, NY", CoverImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", AverageRating = 4.8m, IsVerified = true, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Assembler { Id = 2, UserId = 7, Specialization = "Electronics Setup", Description = "Professional electronics installation and setup specialist. Certified in home theater and smart home systems.", Location = "Los Angeles, CA", CoverImage = "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop", AverageRating = 4.9m, IsVerified = true, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Assembler { Id = 3, UserId = 8, Specialization = "Computer Assembly", Description = "Custom PC building and computer repair expert. Specializes in gaming rigs and workstation builds.", Location = "Chicago, IL", CoverImage = "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop", AverageRating = 4.7m, IsVerified = true, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Assembler { Id = 4, UserId = 9, Specialization = "Appliance Installation", Description = "Licensed appliance installer specializing in dishwashers, washing machines, and dryers.", Location = "Houston, TX", CoverImage = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", AverageRating = 4.6m, IsVerified = true, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Assembler { Id = 5, UserId = 10, Specialization = "Smart Home", Description = "Smart home automation specialist. Expert in Alexa, Google Home, and custom automation systems.", Location = "Phoenix, AZ", CoverImage = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", AverageRating = 4.9m, IsVerified = true, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Assembler { Id = 6, UserId = 11, Specialization = "Outdoor Equipment", Description = "Patio furniture and outdoor equipment assembly specialist. Experienced with grills and outdoor structures.", Location = "Miami, FL", CoverImage = "https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop", AverageRating = 4.5m, IsVerified = true, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Assembler { Id = 7, UserId = 12, Specialization = "Office Setup", Description = "Office furniture and equipment specialist. Expert in ergonomic setups and workspace organization.", Location = "Seattle, WA", CoverImage = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", AverageRating = 4.8m, IsVerified = true, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Assembler { Id = 8, UserId = 13, Specialization = "Home Improvement", Description = "General home improvement and repair specialist. Licensed contractor with 10+ years experience.", Location = "Boston, MA", CoverImage = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop", AverageRating = 4.7m, IsVerified = true, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) }
        );

        // Seed Day Availabilities for all assemblers
        var availabilities = new List<DayAvailability>();
        for (int assemblerId = 1; assemblerId <= 8; assemblerId++)
        {
            for (int day = 1; day <= 7; day++) // Monday to Sunday
            {
                var isWeekend = day == 6 || day == 7; // Saturday or Sunday
                var startHour = isWeekend ? 10 : 8; // Later start on weekends
                var endHour = isWeekend ? 18 : 20; // Earlier end on weekends
                
                availabilities.Add(new DayAvailability
                {
                    Id = (assemblerId - 1) * 7 + day,
                    AssemblerId = assemblerId,
                    DayOfWeek = day,
                    Start = TimeSpan.FromHours(startHour),
                    End = TimeSpan.FromHours(endHour),
                    Available = true,
                    CreatedAt = new DateTime(2024, 1, 1),
                    UpdatedAt = new DateTime(2024, 1, 1)
                });
            }
        }
        modelBuilder.Entity<DayAvailability>().HasData(availabilities.ToArray());

        // Seed Services with comprehensive real data
        modelBuilder.Entity<Service>().HasData(
            // Furniture Assembly Services
            new Service { Id = 1, CategoryId = 1, AssemblerId = 1, Name = "IKEA Furniture Assembly", Description = "Professional IKEA furniture assembly service. Includes all tools and hardware.", Price = 25.00m, ImageUrl = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&q=80", AverageRating = 4.8m, ReviewCount = 15, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 2, CategoryId = 1, AssemblerId = 1, Name = "Office Furniture Setup", Description = "Office furniture assembly and setup", Price = 30.00m, ImageUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&q=80", AverageRating = 4.9m, ReviewCount = 8, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 3, CategoryId = 2, AssemblerId = 2, Name = "TV Mounting", Description = "Professional TV mounting and setup", Price = 50.00m, ImageUrl = "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop&q=80", AverageRating = 4.9m, ReviewCount = 12, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            
            // Electronics Setup Services
            new Service { Id = 4, CategoryId = 2, AssemblerId = 2, Name = "Home Theater Setup", Description = "Complete home theater system installation", Price = 75.00m, ImageUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80", AverageRating = 4.7m, ReviewCount = 6, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 5, CategoryId = 4, AssemblerId = 3, Name = "Custom PC Build", Description = "Custom gaming PC assembly and setup", Price = 100.00m, ImageUrl = "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop&q=80", AverageRating = 4.8m, ReviewCount = 20, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 6, CategoryId = 4, AssemblerId = 3, Name = "Laptop Repair", Description = "Professional laptop repair and maintenance", Price = 40.00m, ImageUrl = "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop&q=80", AverageRating = 4.6m, ReviewCount = 10, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            
            // Computer Services
            new Service { Id = 7, CategoryId = 5, AssemblerId = 2, Name = "Smart Home Setup", Description = "Smart home device installation and configuration", Price = 60.00m, ImageUrl = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80", AverageRating = 4.9m, ReviewCount = 14, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 8, CategoryId = 3, AssemblerId = 1, Name = "General Assembly", Description = "General assembly and installation services", Price = 35.00m, ImageUrl = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&q=80", AverageRating = 4.5m, ReviewCount = 7, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 9, CategoryId = 4, AssemblerId = 3, Name = "Computer Setup & Migration", Description = "New computer setup with data migration from old system.", Price = 55.00m, ImageUrl = "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop", AverageRating = 4.9m, ReviewCount = 14, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            
            // Smart Home Services
            new Service { Id = 10, CategoryId = 5, AssemblerId = 5, Name = "Smart Home Setup", Description = "Smart home device installation and configuration.", Price = 60.00m, ImageUrl = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", AverageRating = 4.9m, ReviewCount = 14, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 11, CategoryId = 5, AssemblerId = 5, Name = "Smart Security System", Description = "Complete smart security system installation and setup.", Price = 80.00m, ImageUrl = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", AverageRating = 4.8m, ReviewCount = 7, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            
            // Appliance Installation
            new Service { Id = 12, CategoryId = 6, AssemblerId = 4, Name = "Dishwasher Installation", Description = "Professional dishwasher installation with plumbing connections.", Price = 70.00m, ImageUrl = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", AverageRating = 4.7m, ReviewCount = 11, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 13, CategoryId = 6, AssemblerId = 4, Name = "Washing Machine Installation", Description = "Washing machine installation with water and electrical connections.", Price = 65.00m, ImageUrl = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", AverageRating = 4.6m, ReviewCount = 8, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            
            // Outdoor Equipment
            new Service { Id = 14, CategoryId = 7, AssemblerId = 6, Name = "Patio Furniture Assembly", Description = "Outdoor patio furniture assembly and setup.", Price = 35.00m, ImageUrl = "https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop", AverageRating = 4.5m, ReviewCount = 6, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 15, CategoryId = 7, AssemblerId = 6, Name = "Grill Assembly & Setup", Description = "Outdoor grill assembly and propane tank connection.", Price = 40.00m, ImageUrl = "https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop", AverageRating = 4.7m, ReviewCount = 9, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            
            // Office Setup
            new Service { Id = 16, CategoryId = 8, AssemblerId = 7, Name = "Office Furniture Setup", Description = "Complete office furniture assembly and ergonomic setup.", Price = 50.00m, ImageUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", AverageRating = 4.8m, ReviewCount = 13, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 17, CategoryId = 8, AssemblerId = 7, Name = "Standing Desk Assembly", Description = "Electric standing desk assembly with cable management.", Price = 45.00m, ImageUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", AverageRating = 4.9m, ReviewCount = 7, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            
            // Home Improvement
            new Service { Id = 18, CategoryId = 3, AssemblerId = 8, Name = "General Assembly Service", Description = "General assembly and installation services for various items.", Price = 35.00m, ImageUrl = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop", AverageRating = 4.5m, ReviewCount = 7, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 19, CategoryId = 3, AssemblerId = 8, Name = "Shelving Installation", Description = "Wall shelving installation with proper mounting.", Price = 30.00m, ImageUrl = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop", AverageRating = 4.6m, ReviewCount = 5, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) },
            new Service { Id = 20, CategoryId = 3, AssemblerId = 8, Name = "Cabinet Assembly", Description = "Kitchen and bathroom cabinet assembly and installation.", Price = 55.00m, ImageUrl = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop", AverageRating = 4.7m, ReviewCount = 10, CreatedAt = new DateTime(2024, 1, 1), UpdatedAt = new DateTime(2024, 1, 1) }
        );
    }
}