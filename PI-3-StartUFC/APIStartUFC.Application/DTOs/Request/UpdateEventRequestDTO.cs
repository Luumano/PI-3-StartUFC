namespace APIStartUFC.Application.DTOs.Request;

public class UpdateEventRequestDTO
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public DateTime Date { get; set; }
    public string Place { get; set; }
    public int Capacity { get; set; }
    public List<ImageDetailsDTO> ImageDetails { get; set; }
    public List<long> DeletedImages { get; set; }
    public long UserId { get; set; }
}
