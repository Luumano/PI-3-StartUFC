namespace APIStartUFC.WebApi.Models.Request;

public class SaveEventRequest
{
    public string Name { get; set; }

    public string Description { get; set; }

    public string StartTime { get; set; }

    public string EndTime { get; set; }

    public DateTime Date { get; set; }

    public string Place { get; set; }

    public int Capacity { get; set; }

    public List<ImageDetailsRequest> ImageDetails { get; set; } = new List<ImageDetailsRequest>();

    public long UserId { get; set; }

}
