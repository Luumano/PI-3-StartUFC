namespace APIStartUFC.Core.Entities;

public class Image : BaseEntity
{
    public long? EventId { get; set; }
    public long? NewsId { get; set; }
    public long? SupporterId { get; set; }
    public long? GalleryId { get; set; }
    public string Filename { get; set; }
    public string Extension { get; set; }

    public static Image Create(string filename, string extension, long? eventId = null, long? newsId = null, long? supporterId = null, long? galleryId = null)
    {
        return new Image
        {
            EventId = eventId,
            NewsId = newsId,
            SupporterId = supporterId,
            GalleryId = galleryId,
            Filename = filename,
            Extension = extension
        };
    }
}
