namespace APIStartUFC.Core.Entities;

public class Supporter : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }

    public static Supporter Create(string name, string description, long userId)
    {
        return new Supporter
        {
            Name = name,
            Description = description,
            CreationUserId = userId
        };
    }
}
