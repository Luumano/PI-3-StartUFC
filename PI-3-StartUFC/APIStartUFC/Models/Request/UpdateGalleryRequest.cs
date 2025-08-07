namespace APIStartUFC.WebApi.Models.Request;

public class UpdateGalleryRequest
{
    public long Id { get; set; }

    public string Title { get; set; }

    public List<ImageDetailsRequest> ImageDetails { get; set; } = new List<ImageDetailsRequest>();

    public List<long> DeletedImages { get; set; } = new List<long>();

    public long UserId { get; set; }
}
