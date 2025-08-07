using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.Application.DTOs.Response;
using APIStartUFC.Application.DTOs.Result;

namespace APIStartUFC.Application.Interfaces;

public interface INewsService
{
    public Task SaveNewsAsync(SaveNewsRequestDTO dto);
    public Task<GetNewsResponseDTO?> GetByIdAsync(long id);
    public Task<bool> DeleteNewsAsync(long id);
    public Task UpdateNewsAsync(UpdateNewsRequestDTO dto);
    public Task<IEnumerable<GetNewsByTitleResponseDTO>> GetByTitleAsync(string term);
    public Task<List<GetNewsResponseDTO>> GetAllAsync();
}
