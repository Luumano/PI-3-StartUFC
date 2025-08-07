using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.Application.DTOs.Response;
using APIStartUFC.Application.DTOs.Result;

namespace APIStartUFC.Application.Interfaces;

public interface IEventService
{
    public Task SaveEventAsync(SaveEventRequestDTO dto);
    public Task<GetEventResponseDTO?> GetByIdAsync(long id);
    public Task<bool> DeleteEventAsync(long id);
    public Task UpdateEventAsync(UpdateEventRequestDTO dto);
    public Task<SignUpEventResponseDTO> SignUpEventAsync(SignUpEventDTO dto);
    public Task<GetEventListByUserIdResposeDTO> GetEventListByUserId(long userId);
    public Task<List<GetEventResponseDTO>> GetAllAsync();
    
}
