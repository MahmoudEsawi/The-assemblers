-- =============================================
-- Assemblers Database Creation Script (CLEAN VERSION)
-- Run this script in SQL Server Management Studio
-- Server: LAPTOP-ME00KT4O\SQLEXPRESS01
-- =============================================

-- Drop database if it exists (to start fresh)
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'AssemblersDb')
BEGIN
    DROP DATABASE AssemblersDb;
END
GO

-- Create Database
CREATE DATABASE AssemblersDb;
GO

USE AssemblersDb;
GO

-- =============================================
-- Create Tables
-- =============================================

-- Users Table
CREATE TABLE [Users] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [Password] nvarchar(255) NOT NULL,
    [Phone] nvarchar(20) NULL,
    [Address] nvarchar(255) NULL,
    [ProfileImage] nvarchar(500) NULL,
    [Role] nvarchar(20) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);

CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
GO

-- Categories Table
CREATE TABLE [Categories] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [Image] nvarchar(500) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Categories] PRIMARY KEY ([Id])
);
GO

-- Assemblers Table
CREATE TABLE [Assemblers] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [UserId] int NOT NULL,
    [Specialization] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [Location] nvarchar(100) NULL,
    [CoverImage] nvarchar(500) NULL,
    [AverageRating] decimal(3,2) NOT NULL,
    [IsVerified] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Assemblers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Assemblers_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);
GO

-- DayAvailabilities Table
CREATE TABLE [DayAvailabilities] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [AssemblerId] int NOT NULL,
    [DayOfWeek] int NOT NULL,
    [Start] time NOT NULL,
    [End] time NOT NULL,
    [Available] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_DayAvailabilities] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_DayAvailabilities_Assemblers_AssemblerId] FOREIGN KEY ([AssemblerId]) REFERENCES [Assemblers] ([Id]) ON DELETE CASCADE
);
GO

-- Services Table
CREATE TABLE [Services] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [CategoryId] int NOT NULL,
    [AssemblerId] int NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [Price] decimal(10,2) NOT NULL,
    [ImageUrl] nvarchar(500) NULL,
    [AverageRating] decimal(3,2) NOT NULL,
    [ReviewCount] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Services] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Services_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Services_Assemblers_AssemblerId] FOREIGN KEY ([AssemblerId]) REFERENCES [Assemblers] ([Id]) ON DELETE CASCADE
);
GO

-- Bookings Table
CREATE TABLE [Bookings] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [CustomerId] int NOT NULL,
    [AssemblerId] int NOT NULL,
    [ServiceId] int NOT NULL,
    [BookingDate] datetime2 NOT NULL,
    [Status] int NOT NULL,
    [Notes] nvarchar(500) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Bookings] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Bookings_Users_CustomerId] FOREIGN KEY ([CustomerId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Bookings_Assemblers_AssemblerId] FOREIGN KEY ([AssemblerId]) REFERENCES [Assemblers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Bookings_Services_ServiceId] FOREIGN KEY ([ServiceId]) REFERENCES [Services] ([Id]) ON DELETE NO ACTION
);
GO

-- Reviews Table
CREATE TABLE [Reviews] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [CustomerId] int NOT NULL,
    [AssemblerId] int NOT NULL,
    [BookingId] int NOT NULL,
    [Rating] int NOT NULL,
    [Comment] nvarchar(500) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Reviews] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Reviews_Users_CustomerId] FOREIGN KEY ([CustomerId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Reviews_Assemblers_AssemblerId] FOREIGN KEY ([AssemblerId]) REFERENCES [Assemblers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Reviews_Bookings_BookingId] FOREIGN KEY ([BookingId]) REFERENCES [Bookings] ([Id]) ON DELETE NO ACTION
);
GO

-- =============================================
-- Insert Real Data
-- =============================================

-- Insert Categories
INSERT INTO [Categories] ([Name], [Description], [Image], [CreatedAt], [UpdatedAt])
VALUES 
('Furniture Assembly', 'Professional furniture assembly services for IKEA, Wayfair, and other brands', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', '2024-01-01', '2024-01-01'),
('Electronics Setup', 'TV mounting, home theater installation, and electronics setup', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop', '2024-01-01', '2024-01-01'),
('Home Improvement', 'General home improvement, repair, and installation services', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop', '2024-01-01', '2024-01-01'),
('Computer Services', 'Custom PC building, laptop repair, and computer setup', 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop', '2024-01-01', '2024-01-01'),
('Smart Home', 'Smart home device installation, configuration, and automation', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', '2024-01-01', '2024-01-01'),
('Appliance Installation', 'Dishwasher, washing machine, dryer, and appliance installation', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', '2024-01-01', '2024-01-01'),
('Outdoor Equipment', 'Patio furniture, grills, and outdoor equipment assembly', 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop', '2024-01-01', '2024-01-01'),
('Office Setup', 'Office furniture, equipment, and workspace organization', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', '2024-01-01', '2024-01-01');
GO

-- Insert Users (Customers and Assemblers)
INSERT INTO [Users] ([Name], [Email], [Password], [Phone], [Address], [ProfileImage], [Role], [CreatedAt], [UpdatedAt])
VALUES 
-- Customers
('John Smith', 'john.smith@email.com', '75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=', '+1-555-0123', '123 Main Street, New York, NY 10001', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Customer', '2024-01-01', '2024-01-01'),
('Sarah Johnson', 'sarah.johnson@email.com', '75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=', '+1-555-0124', '456 Oak Avenue, Los Angeles, CA 90210', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'Customer', '2024-01-01', '2024-01-01'),
('Michael Brown', 'michael.brown@email.com', '75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=', '+1-555-0125', '789 Pine Road, Chicago, IL 60601', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Customer', '2024-01-01', '2024-01-01'),
('Emily Davis', 'emily.davis@email.com', '75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=', '+1-555-0126', '321 Elm Street, Houston, TX 77001', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Customer', '2024-01-01', '2024-01-01'),
('David Wilson', 'david.wilson@email.com', '75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=', '+1-555-0127', '654 Maple Drive, Phoenix, AZ 85001', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'Customer', '2024-01-01', '2024-01-01'),

-- Assemblers
('Mike Rodriguez', 'mike.rodriguez@assemblers.com', '75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=', '+1-555-0201', '100 Assembly Lane, New York, NY 10002', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Assembler', '2024-01-01', '2024-01-01'),
('Lisa Chen', 'lisa.chen@assemblers.com', '75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=', '+1-555-0202', '200 Tech Street, Los Angeles, CA 90211', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'Assembler', '2024-01-01', '2024-01-01'),
('James Thompson', 'james.thompson@assemblers.com', '75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=', '+1-555-0203', '300 Build Avenue, Chicago, IL 60602', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Assembler', '2024-01-01', '2024-01-01'),
('Maria Garcia', 'maria.garcia@assemblers.com', '75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=', '+1-555-0204', '400 Install Road, Houston, TX 77002', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Assembler', '2024-01-01', '2024-01-01'),
('Robert Lee', 'robert.lee@assemblers.com', '75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=', '+1-555-0205', '500 Setup Boulevard, Phoenix, AZ 85002', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'Assembler', '2024-01-01', '2024-01-01'),
('Jennifer Martinez', 'jennifer.martinez@assemblers.com', '75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=', '+1-555-0206', '600 Fix Street, Miami, FL 33101', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'Assembler', '2024-01-01', '2024-01-01'),
('Kevin Anderson', 'kevin.anderson@assemblers.com', '75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=', '+1-555-0207', '700 Repair Lane, Seattle, WA 98101', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Assembler', '2024-01-01', '2024-01-01'),
('Amanda Taylor', 'amanda.taylor@assemblers.com', '75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=', '+1-555-0208', '800 Service Drive, Boston, MA 02101', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Assembler', '2024-01-01', '2024-01-01');
GO

-- Insert Assemblers
INSERT INTO [Assemblers] ([UserId], [Specialization], [Description], [Location], [CoverImage], [AverageRating], [IsVerified], [CreatedAt], [UpdatedAt])
VALUES 
(6, 'Furniture Assembly', 'Expert in IKEA, Wayfair, and other furniture assembly. 5+ years experience with complex furniture builds.', 'New York, NY', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', 4.80, 1, '2024-01-01', '2024-01-01'),
(7, 'Electronics Setup', 'Professional electronics installation and setup specialist. Certified in home theater and smart home systems.', 'Los Angeles, CA', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop', 4.90, 1, '2024-01-01', '2024-01-01'),
(8, 'Computer Assembly', 'Custom PC building and computer repair expert. Specializes in gaming rigs and workstation builds.', 'Chicago, IL', 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop', 4.70, 1, '2024-01-01', '2024-01-01'),
(9, 'Appliance Installation', 'Licensed appliance installer specializing in dishwashers, washing machines, and dryers.', 'Houston, TX', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', 4.60, 1, '2024-01-01', '2024-01-01'),
(10, 'Smart Home', 'Smart home automation specialist. Expert in Alexa, Google Home, and custom automation systems.', 'Phoenix, AZ', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', 4.90, 1, '2024-01-01', '2024-01-01'),
(11, 'Outdoor Equipment', 'Patio furniture and outdoor equipment assembly specialist. Experienced with grills and outdoor structures.', 'Miami, FL', 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop', 4.50, 1, '2024-01-01', '2024-01-01'),
(12, 'Office Setup', 'Office furniture and equipment specialist. Expert in ergonomic setups and workspace organization.', 'Seattle, WA', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 4.80, 1, '2024-01-01', '2024-01-01'),
(13, 'Home Improvement', 'General home improvement and repair specialist. Licensed contractor with 10+ years experience.', 'Boston, MA', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop', 4.70, 1, '2024-01-01', '2024-01-01');
GO

-- Insert Day Availabilities
DECLARE @AssemblerId INT = 1;
DECLARE @DayOfWeek INT = 1;

WHILE @AssemblerId <= 8
BEGIN
    SET @DayOfWeek = 1;
    WHILE @DayOfWeek <= 7
    BEGIN
        DECLARE @StartHour INT = CASE WHEN @DayOfWeek IN (6, 7) THEN 10 ELSE 8 END;
        DECLARE @EndHour INT = CASE WHEN @DayOfWeek IN (6, 7) THEN 18 ELSE 20 END;
        
        INSERT INTO [DayAvailabilities] ([AssemblerId], [DayOfWeek], [Start], [End], [Available], [CreatedAt], [UpdatedAt])
        VALUES (@AssemblerId, @DayOfWeek, CAST(CAST(@StartHour AS VARCHAR(2)) + ':00:00' AS TIME), CAST(CAST(@EndHour AS VARCHAR(2)) + ':00:00' AS TIME), 1, '2024-01-01', '2024-01-01');
        
        SET @DayOfWeek = @DayOfWeek + 1;
    END
    SET @AssemblerId = @AssemblerId + 1;
END
GO

-- Insert Services
INSERT INTO [Services] ([CategoryId], [AssemblerId], [Name], [Description], [Price], [ImageUrl], [AverageRating], [ReviewCount], [CreatedAt], [UpdatedAt])
VALUES 
-- Furniture Assembly Services
(1, 1, 'IKEA Furniture Assembly', 'Professional IKEA furniture assembly service. Includes all tools and hardware.', 25.00, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', 4.80, 15, '2024-01-01', '2024-01-01'),
(1, 1, 'Wayfair Furniture Assembly', 'Expert Wayfair furniture assembly with cleanup included.', 30.00, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 4.90, 8, '2024-01-01', '2024-01-01'),
(1, 1, 'Bedroom Set Assembly', 'Complete bedroom furniture assembly including bed frames, dressers, and nightstands.', 45.00, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', 4.70, 12, '2024-01-01', '2024-01-01'),

-- Electronics Setup Services
(2, 2, 'TV Mounting Service', 'Professional TV mounting on walls with cable management.', 50.00, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop', 4.90, 12, '2024-01-01', '2024-01-01'),
(2, 2, 'Home Theater Setup', 'Complete home theater system installation and configuration.', 75.00, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', 4.70, 6, '2024-01-01', '2024-01-01'),
(2, 2, 'Sound System Installation', 'Speaker and sound system installation with calibration.', 60.00, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop', 4.80, 9, '2024-01-01', '2024-01-01'),

-- Computer Services
(4, 3, 'Custom PC Build', 'Custom gaming PC assembly and setup with OS installation.', 100.00, 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop', 4.80, 20, '2024-01-01', '2024-01-01'),
(4, 3, 'Laptop Repair Service', 'Professional laptop repair and maintenance service.', 40.00, 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop', 4.60, 10, '2024-01-01', '2024-01-01'),
(4, 3, 'Computer Setup & Migration', 'New computer setup with data migration from old system.', 55.00, 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop', 4.90, 14, '2024-01-01', '2024-01-01'),

-- Smart Home Services
(5, 5, 'Smart Home Setup', 'Smart home device installation and configuration.', 60.00, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', 4.90, 14, '2024-01-01', '2024-01-01'),
(5, 5, 'Smart Security System', 'Complete smart security system installation and setup.', 80.00, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', 4.80, 7, '2024-01-01', '2024-01-01'),

-- Appliance Installation
(6, 4, 'Dishwasher Installation', 'Professional dishwasher installation with plumbing connections.', 70.00, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', 4.70, 11, '2024-01-01', '2024-01-01'),
(6, 4, 'Washing Machine Installation', 'Washing machine installation with water and electrical connections.', 65.00, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', 4.60, 8, '2024-01-01', '2024-01-01'),

-- Outdoor Equipment
(7, 6, 'Patio Furniture Assembly', 'Outdoor patio furniture assembly and setup.', 35.00, 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop', 4.50, 6, '2024-01-01', '2024-01-01'),
(7, 6, 'Grill Assembly & Setup', 'Outdoor grill assembly and propane tank connection.', 40.00, 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop', 4.70, 9, '2024-01-01', '2024-01-01'),

-- Office Setup
(8, 7, 'Office Furniture Setup', 'Complete office furniture assembly and ergonomic setup.', 50.00, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 4.80, 13, '2024-01-01', '2024-01-01'),
(8, 7, 'Standing Desk Assembly', 'Electric standing desk assembly with cable management.', 45.00, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', 4.90, 7, '2024-01-01', '2024-01-01'),

-- Home Improvement
(3, 8, 'General Assembly Service', 'General assembly and installation services for various items.', 35.00, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop', 4.50, 7, '2024-01-01', '2024-01-01'),
(3, 8, 'Shelving Installation', 'Wall shelving installation with proper mounting.', 30.00, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop', 4.60, 5, '2024-01-01', '2024-01-01'),
(3, 8, 'Cabinet Assembly', 'Kitchen and bathroom cabinet assembly and installation.', 55.00, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop', 4.70, 10, '2024-01-01', '2024-01-01');
GO

-- =============================================
-- Verification Queries
-- =============================================

PRINT 'Database setup completed successfully!';

DECLARE @CategoryCount INT = (SELECT COUNT(*) FROM Categories);
DECLARE @UserCount INT = (SELECT COUNT(*) FROM Users);
DECLARE @AssemblerCount INT = (SELECT COUNT(*) FROM Assemblers);
DECLARE @ServiceCount INT = (SELECT COUNT(*) FROM Services);
DECLARE @AvailabilityCount INT = (SELECT COUNT(*) FROM DayAvailabilities);

PRINT 'Total Categories: ' + CAST(@CategoryCount AS VARCHAR(10));
PRINT 'Total Users: ' + CAST(@UserCount AS VARCHAR(10));
PRINT 'Total Assemblers: ' + CAST(@AssemblerCount AS VARCHAR(10));
PRINT 'Total Services: ' + CAST(@ServiceCount AS VARCHAR(10));
PRINT 'Total Day Availabilities: ' + CAST(@AvailabilityCount AS VARCHAR(10));

-- Show sample data
SELECT 'Categories' as TableName, @CategoryCount as RecordCount
UNION ALL
SELECT 'Users', @UserCount
UNION ALL
SELECT 'Assemblers', @AssemblerCount
UNION ALL
SELECT 'Services', @ServiceCount
UNION ALL
SELECT 'DayAvailabilities', @AvailabilityCount;
GO
