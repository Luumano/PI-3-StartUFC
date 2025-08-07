using APIStartUFC.Core.Entities;
using System.Data;

namespace APIStartUFC.Infrastructure.Interfaces;

public interface IImageRepository
{
    public Task SaveImage(Image image, IDbConnection connection, IDbTransaction transaction);
    public Task<List<Image>> GetImageListByEventId(long eventId);
    public Task<List<Image>> GetImageListByNewsId(long newsId);
    public Task<List<Image>> GetImageListByGalleryId(long galleryId);
    public Task<List<Image>> GetImageListBySupporterId(long supporterId);
    public Task DeleteImageAsync(long imageId, IDbConnection connection, IDbTransaction transaction);
}
