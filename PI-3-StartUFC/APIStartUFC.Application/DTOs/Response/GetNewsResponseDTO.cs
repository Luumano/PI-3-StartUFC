using APIStartUFC.Application.DTOs.Request;

namespace APIStartUFC.Application.DTOs.Result;

public class GetNewsResponseDTO
{
    public long Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public List<ImageDetailsDTO> ImageDetails { get; set; } = new List<ImageDetailsDTO>();
}
