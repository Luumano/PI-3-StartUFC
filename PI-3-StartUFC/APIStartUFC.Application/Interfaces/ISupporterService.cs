using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.Application.DTOs.Result;

namespace APIStartUFC.Application.Interfaces;

public interface ISupporterService
{
    public Task SaveSupporterAsync(SaveSupporterRequestDTO dto);
    public Task<GetSupporterResponseDTO?> GetByIdAsync(long id);
    public Task<bool> DeleteSupporterAsync(long id);
    public Task UpdateSupporterAsync(UpdateSupporterRequestDTO dto);    
    public Task<List<GetSupporterResponseDTO>> GetAllAsync();
}
