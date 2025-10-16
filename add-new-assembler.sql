-- Add a new assembler to your database
USE AssemblersDb;

-- First, add a new user (assembler)
INSERT INTO [Users] ([Name], [Email], [Password], [Phone], [Address], [ProfileImage], [Role], [CreatedAt], [UpdatedAt]) 
VALUES (
    'Ahmed Hassan', 
    'ahmed.hassan@assemblers.com', 
    '75K3eLr+dx6JJFuJ7LwIpEpOFmwGZZkRiB84PURz6U8=', 
    '+1-555-0209', 
    '900 Tech Street, Dallas, TX 75201', 
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 
    'Assembler', 
    '2024-01-01', 
    '2024-01-01'
);

-- Get the new user ID (assuming it's the next available ID)
DECLARE @NewUserId INT = SCOPE_IDENTITY();

-- Add the assembler profile
INSERT INTO [Assemblers] ([UserId], [Specialization], [Description], [Location], [CoverImage], [AverageRating], [IsVerified], [CreatedAt], [UpdatedAt]) 
VALUES (
    @NewUserId,
    'Smart Home Installation',
    'Expert in smart home automation, security systems, and IoT device setup. Certified technician with 3+ years experience.',
    'Dallas, TX',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    4.8,
    1,
    '2024-01-01',
    '2024-01-01'
);

-- Get the new assembler ID
DECLARE @NewAssemblerId INT = SCOPE_IDENTITY();

-- Add availability for the new assembler (7 days)
DECLARE @DayOfWeek INT = 1;
WHILE @DayOfWeek <= 7
BEGIN
    DECLARE @StartHour INT = CASE WHEN @DayOfWeek IN (6, 7) THEN 10 ELSE 8 END;
    DECLARE @EndHour INT = CASE WHEN @DayOfWeek IN (6, 7) THEN 18 ELSE 20 END;
    
    INSERT INTO [DayAvailabilities] ([AssemblerId], [DayOfWeek], [Start], [End], [Available], [CreatedAt], [UpdatedAt])
    VALUES (@NewAssemblerId, @DayOfWeek, CAST(CAST(@StartHour AS VARCHAR(2)) + ':00:00' AS TIME), CAST(CAST(@EndHour AS VARCHAR(2)) + ':00:00' AS TIME), 1, '2024-01-01', '2024-01-01');
    
    SET @DayOfWeek = @DayOfWeek + 1;
END

-- Add some services for the new assembler
INSERT INTO [Services] ([CategoryId], [AssemblerId], [Name], [Description], [Price], [ImageUrl], [AverageRating], [ReviewCount], [CreatedAt], [UpdatedAt]) 
VALUES 
(5, @NewAssemblerId, 'Smart Security System Setup', 'Complete smart security system installation with cameras, sensors, and mobile app setup', 120.00, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', 4.9, 0, '2024-01-01', '2024-01-01'),
(5, @NewAssemblerId, 'Smart Lighting Installation', 'Smart light switches, bulbs, and automation setup with voice control', 80.00, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', 4.7, 0, '2024-01-01', '2024-01-01'),
(5, @NewAssemblerId, 'Smart Thermostat Setup', 'Smart thermostat installation and configuration with energy saving features', 60.00, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', 4.8, 0, '2024-01-01', '2024-01-01');

-- Verify the new assembler was added
SELECT 'New Assembler Added Successfully!' as Message;
SELECT u.Name, u.Email, a.Specialization, a.Location, a.AverageRating 
FROM Users u 
JOIN Assemblers a ON u.Id = a.UserId 
WHERE u.Email = 'ahmed.hassan@assemblers.com';
