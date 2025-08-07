using APIStartUFC.Application.DTOs.Request;

namespace APIStartUFC.Application.DTOs.Result;

public class GetSupporterResponseDTO
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public List<ImageDetailsDTO> ImageDetails { get; set; } = new List<ImageDetailsDTO>();
}
