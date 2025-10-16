-- Update existing users with hashed passwords and add new test users
USE AssemblersDb;

-- First, let's see what users we have
SELECT 'Current Users:' as Status;
SELECT Id, Name, Email, Role FROM Users;

-- Update existing users with hashed passwords (using simple hash for demo)
-- In production, use proper password hashing
UPDATE Users 
SET Password = 'hashed_password_' + CAST(Id AS NVARCHAR(10)) + '_demo'
WHERE Id > 0;

-- Add some test users for login
INSERT INTO Users (Name, Email, Password, Phone, Address, Role, CreatedAt, UpdatedAt)
VALUES 
    ('Test Customer', 'customer@test.com', 'hashed_password_customer_demo', '1234567890', '123 Test St', 'Customer', GETUTCDATE(), GETUTCDATE()),
    ('Test Assembler', 'assembler@test.com', 'hashed_password_assembler_demo', '0987654321', '456 Assembly Ave', 'Assembler', GETUTCDATE(), GETUTCDATE()),
    ('Admin User', 'admin@test.com', 'hashed_password_admin_demo', '5555555555', '789 Admin Blvd', 'Admin', GETUTCDATE(), GETUTCDATE());

-- Verify the users
SELECT 'Updated Users:' as Status;
SELECT Id, Name, Email, Role, Password FROM Users ORDER BY Id;

-- Show login test credentials
SELECT 'Login Test Credentials:' as Status;
SELECT 
    'Email: ' + Email + ', Password: demo123' as LoginInfo,
    'Role: ' + Role as UserRole
FROM Users 
WHERE Email IN ('customer@test.com', 'assembler@test.com', 'admin@test.com')
ORDER BY Role;
