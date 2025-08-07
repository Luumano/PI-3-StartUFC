namespace APIStartUFC.Application.DTOs.Request;

public class SaveSupporterRequestDTO
{
    public string Name { get; set; }
    public string Description { get; set; }
    public List<ImageDetailsDTO> ImageDetails { get; set; }
    public long UserId { get; set; }
}
