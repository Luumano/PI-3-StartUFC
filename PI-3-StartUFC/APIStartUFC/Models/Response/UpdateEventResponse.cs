using APIStartUFC.WebApi.Models.Request;

namespace APIStartUFC.WebApi.Models.Response;

public class UpdateEventResponse
{
    public long Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public DateTime Date { get; set; }

    public string Place { get; set; }

    public int Capacity { get; set; }

    public List<ImageDetailsRequest> ImageDetails { get; set; } = new List<ImageDetailsRequest>();

}
