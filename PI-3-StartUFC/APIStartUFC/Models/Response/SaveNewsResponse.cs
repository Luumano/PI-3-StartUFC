using APIStartUFC.WebApi.Models.Request;

namespace APIStartUFC.WebApi.Models.Response;

public class SaveNewsResponse
{
    public string Title { get; set; }

    public string Content { get; set; }

    public List<ImageDetailsRequest> ImageDetails { get; set; } = new List<ImageDetailsRequest>();


}
