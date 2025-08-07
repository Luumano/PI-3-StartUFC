namespace APIStartUFC.WebApi.Models.Request;

public class UpdateSupporterRequest
{
    public long Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public List<ImageDetailsRequest> ImageDetails { get; set; } = new List<ImageDetailsRequest>();

    public List<long> DeletedImages { get; set; } = new List<long>();
    public long UserId { get; set; }
}
