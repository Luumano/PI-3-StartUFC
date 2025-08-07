using APIStartUFC.WebApi.Models.Request;

namespace APIStartUFC.WebApi.Models.Response;

public class SaveGalleryResponse
{
    public string Title { get; set; }

    public List<ImageDetailsRequest> ImageDetails { get; set; } = new List<ImageDetailsRequest>();

}
