namespace APIStartUFC.Core.Entities;

public class UserEvent : BaseEntity
{
    public long UserId { get; set; }
    public long EventId { get; set; }
    public string Identifier { get; set; } = string.Empty;

    public static UserEvent Create(long eventId, long userId)
    {
        return new UserEvent
        {
            UserId = userId,
            EventId = eventId,
            Identifier = Guid.NewGuid().ToString(),
            CreationUserId = userId
        };
    }
}
