using APIStartUFC.Core.Entities;
using APIStartUFC.Infrastructure.Interfaces;
using Dapper;
using System.Data;

namespace APIStartUFC.Infrastructure.Repositories;

public class ImageRepository : IImageRepository
{
    private readonly IDbContext _dbContext;

    public ImageRepository(IDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task SaveImage(Image image, IDbConnection connection, IDbTransaction transaction)
    {
        try
        {
            await connection.QueryAsync(
                "INSERT INTO Image (EventId, NewsId, SupporterId, GalleryId, Filename, Extension, CreatedAt) " +
                "VALUES (@EventId, @NewsId, @SupporterId, @GalleryId, @Filename, @Extension, @CreatedAt)",
                image, transaction);
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao salvar a imagem", ex);
        }
    }

    public async Task<List<Image>> GetImageListByEventId(long eventId)
    {
        using var connection = _dbContext.CreateConnection();

        IEnumerable<Image> imageList = await connection.QueryAsync<Image>("SELECT * FROM Image WHERE EventId = @eventId", new { eventId });

        return imageList.ToList();
    }

    public async Task<List<Image>> GetImageListByNewsId(long newsId)
    {
        using var connection = _dbContext.CreateConnection();

        IEnumerable<Image> imageList = await connection.QueryAsync<Image>("SELECT * FROM Image WHERE NewsId = @newsId", new { newsId });

        return imageList.ToList();
    }

    public async Task<List<Image>> GetImageListBySupporterId(long supporterId)
    {
        using var connection = _dbContext.CreateConnection();

        IEnumerable<Image> imageList = await connection.QueryAsync<Image>("SELECT * FROM Image WHERE SupporterId = @supporterId", new { supporterId });

        return imageList.ToList();
    }

    public async Task<List<Image>> GetImageListByGalleryId(long galleryId)
    {
        using var connection = _dbContext.CreateConnection();

        IEnumerable<Image> imageList = await connection.QueryAsync<Image>("SELECT * FROM Image WHERE GalleryId = @galleryId", new { galleryId });

        return imageList.ToList();
    }
    public async Task DeleteImageAsync(long imageId, IDbConnection connection, IDbTransaction transaction)
    {
        const string sql = "DELETE FROM Image WHERE Id = @Id";

        await connection.ExecuteAsync(sql, new { Id = imageId }, transaction);
    }

}
