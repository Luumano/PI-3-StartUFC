namespace APIStartUFC.Application.DTOs.Request;

public class UpdateGalleryRequestDTO
{

    public long Id { get; set; }
    public string Title { get; set; }
    public List<ImageDetailsDTO> ImageDetails { get; set; }
    public List<long> DeletedImages { get; set; }
    public long UserId { get; set; }
}
