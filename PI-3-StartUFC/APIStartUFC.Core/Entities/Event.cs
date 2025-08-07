using APIStartUFC.Core.Entities;

namespace APIStartUFC.src.Core.Entities;
public class Event : BaseEntity
{    
    public string Name { get; set; }
    public string Description { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public DateTime Date { get; set; }
    public string Place { get; set; }
    public int Capacity { get; set; }

    public static Event Create(string name, string description, TimeSpan startTime, TimeSpan endTime, DateTime date, string place, int capacity, long userId)
    {
        return new Event
        {
            Name = name,
            Description = description,
            StartTime = startTime,
            EndTime = endTime,
            Date = date,
            Place = place,
            Capacity = capacity,
            CreationUserId = userId,
        };
    }
}
