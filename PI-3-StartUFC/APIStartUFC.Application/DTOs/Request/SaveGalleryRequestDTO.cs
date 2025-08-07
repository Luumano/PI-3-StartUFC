namespace APIStartUFC.Application.DTOs.Request;

public class SaveGalleryRequestDTO
{
    public string Title { get; set; }
    public List<ImageDetailsDTO> ImageDetails { get; set; }
    public long UserId { get; set; }
}
