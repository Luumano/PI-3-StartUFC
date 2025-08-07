namespace APIStartUFC.WebApi.Models.Request;

public class SaveSupporterRequest
{
    public string Name { get; set; }

    public string Description { get; set; }

    public List<ImageDetailsRequest> ImageDetails { get; set; } = new List<ImageDetailsRequest>();

    public long UserId { get; set; }
}
