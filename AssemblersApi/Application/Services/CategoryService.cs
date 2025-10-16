using AssemblersApi.Application.DTOs;
using AssemblersApi.Application.Interfaces;
using AssemblersApi.Domain.Entities;
using AssemblersApi.Domain.Interfaces;

namespace AssemblersApi.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            Image = c.Image,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        });
    }

    public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        return category == null ? null : new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            Image = category.Image,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
    }

    public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto categoryDto)
    {
        var category = new Category
        {
            Name = categoryDto.Name,
            Description = categoryDto.Description,
            Image = categoryDto.Image
        };
        await _categoryRepository.AddAsync(category);
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            Image = category.Image,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
    }

    public async Task UpdateCategoryAsync(int id, UpdateCategoryDto categoryDto)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null) return;

        category.Name = categoryDto.Name ?? category.Name;
        category.Description = categoryDto.Description ?? category.Description;
        category.Image = categoryDto.Image ?? category.Image;

        await _categoryRepository.UpdateAsync(category);
    }

    public async Task DeleteCategoryAsync(int id)
    {
        await _categoryRepository.DeleteAsync(id);
    }

    // Additional interface methods
    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
        return await GetCategoryByIdAsync(id);
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        return await GetAllCategoriesAsync();
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto createCategoryDto)
    {
        return await CreateCategoryAsync(createCategoryDto);
    }

    public async Task UpdateAsync(int id, UpdateCategoryDto updateCategoryDto)
    {
        await UpdateCategoryAsync(id, updateCategoryDto);
    }

    public async Task DeleteAsync(int id)
    {
        await DeleteCategoryAsync(id);
    }
}
