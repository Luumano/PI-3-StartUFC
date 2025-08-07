using APIStartUFC.Application.DTOs.Result;

namespace APIStartUFC.Application.DTOs.Response;

public class GetEventListByUserIdResposeDTO
{
    public List<GetEventResponseDTO> EventList { get; set; }
}
