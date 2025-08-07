namespace APIStartUFC.WebApi.Models.Request;

public class SaveGalleryRequest
{
    public string Title { get; set; }

    public List<ImageDetailsRequest> ImageDetails { get; set; } = new List<ImageDetailsRequest>();

    public long UserId { get; set; }
}
