using System.Security.Cryptography;
using System.Text;
using AssemblersApi.Application.DTOs;
using AssemblersApi.Application.Interfaces;
using AssemblersApi.Domain.Entities;
using AssemblersApi.Domain.Interfaces;

namespace AssemblersApi.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto loginRequest)
        {
            try
            {
                var user = await _userRepository.GetByEmailAsync(loginRequest.Email);
                
                if (user == null || user.IsDeleted)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                if (!VerifyPassword(loginRequest.Password, user.Password))
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                var userDto = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Phone = user.Phone,
                    Address = user.Address,
                    ProfileImage = user.ProfileImage,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt
                };

                return new AuthResponseDto
                {
                    Success = true,
                    Message = "Login successful",
                    User = userDto,
                    Token = GenerateSimpleToken(user.Id, user.Email)
                };
            }
            catch (Exception ex)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = $"Login failed: {ex.Message}"
                };
            }
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto registerRequest)
        {
            try
            {
                // Check if user already exists
                var existingUser = await _userRepository.GetByEmailAsync(registerRequest.Email);
                if (existingUser != null)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "User with this email already exists"
                    };
                }

                // Create new user
                var user = new User
                {
                    Name = registerRequest.Name,
                    Email = registerRequest.Email,
                    Password = HashPassword(registerRequest.Password),
                    Phone = registerRequest.Phone,
                    Address = registerRequest.Address,
                    Role = registerRequest.Role,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsDeleted = false
                };

                var createdUser = await _userRepository.AddAsync(user);

                var userDto = new UserDto
                {
                    Id = createdUser.Id,
                    Name = createdUser.Name,
                    Email = createdUser.Email,
                    Phone = createdUser.Phone,
                    Address = createdUser.Address,
                    ProfileImage = createdUser.ProfileImage,
                    Role = createdUser.Role,
                    CreatedAt = createdUser.CreatedAt
                };

                return new AuthResponseDto
                {
                    Success = true,
                    Message = "Registration successful",
                    User = userDto,
                    Token = GenerateSimpleToken(createdUser.Id, createdUser.Email)
                };
            }
            catch (Exception ex)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = $"Registration failed: {ex.Message}"
                };
            }
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "salt"));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            var hashedInput = HashPassword(password);
            return hashedInput == hashedPassword;
        }

        private string GenerateSimpleToken(int userId, string email)
        {
            var tokenData = $"{userId}:{email}:{DateTime.UtcNow:yyyyMMddHHmmss}";
            var tokenBytes = Encoding.UTF8.GetBytes(tokenData);
            return Convert.ToBase64String(tokenBytes);
        }
    }
}
