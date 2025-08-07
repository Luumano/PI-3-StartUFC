namespace APIStartUFC.Core.Entities;

public class BaseEntity
{
    public long Id { get; set; }
    public long CreationUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? DeletedAt { get; set; }
}
