namespace APIStartUFC.Application.DTOs.Request;

public class SaveNewsRequestDTO
{
    public string Title { get; set; }
    public string Content { get; set; }
    public List<ImageDetailsDTO> ImageDetails { get; set; }
    public long UserId { get; set; }
}
