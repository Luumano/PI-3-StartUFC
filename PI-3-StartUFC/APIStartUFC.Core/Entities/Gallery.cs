namespace APIStartUFC.Core.Entities;

public class Gallery : BaseEntity
{
    public string Title { get; set; }

    public static Gallery Create(string title, long userId)
    {
        return new Gallery
        {
            Title = title,
            CreationUserId = userId
        };
    }
}
