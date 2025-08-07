namespace APIStartUFC.Application.DTOs.Request;

public class UpdateSupporterRequestDTO
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public List<ImageDetailsDTO> ImageDetails { get; set; }
    public List<long> DeletedImages { get; set; }
    public long UserId { get; set; }
}
