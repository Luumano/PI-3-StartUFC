using APIStartUFC.Application.DTOs.Request;

namespace APIStartUFC.Application.DTOs.Result;

public class GetEventResponseDTO
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public DateOnly Date { get; set; }
    public string Place { get; set; }
    public int Capacity { get; set; }
    public List<ImageDetailsDTO> ImageDetails { get; set; } = new List<ImageDetailsDTO>();
}
