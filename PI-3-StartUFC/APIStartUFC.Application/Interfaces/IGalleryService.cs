using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.Application.DTOs.Result;

namespace APIStartUFC.Application.Interfaces;

public interface IGalleryService
{
    public Task SaveGalleryAsync(SaveGalleryRequestDTO dto);
    public Task<GetGalleryResponseDTO?> GetByIdAsync(long id);
    public Task<bool> DeleteGalleryAsync(long id);
    public Task UpdateGalleryAsync(UpdateGalleryRequestDTO dto);
    public Task<List<GetGalleryResponseDTO>> GetAllAsync();
}
