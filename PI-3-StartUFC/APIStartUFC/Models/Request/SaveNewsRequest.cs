namespace APIStartUFC.WebApi.Models.Request;

public class SaveNewsRequest
{
    public string Title { get; set; }

    public string Content { get; set; }

    public List<ImageDetailsRequest> ImageDetails { get; set; } = new List<ImageDetailsRequest>();

    public long UserId { get; set; }

}
