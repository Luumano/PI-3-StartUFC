using APIStartUFC.Core.Entities;

namespace APIStartUFC.src.Core.Entities;

public class News : BaseEntity
{
    public string Title { get; set; }
    public string Content { get; set; }

    public static News Create(string title, string content, long userId)
    {
        return new News
        {
            Title = title,
            Content = content,
            CreationUserId = userId
        };
    }
}
