using APIStartUFC.WebApi.Models.Request;

namespace APIStartUFC.WebApi.Models.Response;

public class UpdateNewsResponse
{
    public long Id { get; set; }

    public string Title { get; set; }

    public string Content { get; set; }

    public List<ImageDetailsRequest> ImageDetails { get; set; } = new List<ImageDetailsRequest>();


}
