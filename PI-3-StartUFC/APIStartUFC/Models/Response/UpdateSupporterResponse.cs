using APIStartUFC.WebApi.Models.Request;

namespace APIStartUFC.WebApi.Models.Response;

public class UpdateSupporterResponse
{
    public long Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public List<ImageDetailsRequest> ImageDetails { get; set; } = new List<ImageDetailsRequest>();

}
