using APIStartUFC.Core.Entities;
using APIStartUFC.Infrastructure.Interfaces;
using Dapper;
using System.Data;

namespace APIStartUFC.Infrastructure.Repositories;

public class GalleryRepository : IGalleryRepository
{
    private readonly IDbContext _dbContext;

    public GalleryRepository(IDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<long> SaveNewGalleryAsync(Gallery gallery, IDbConnection connection, IDbTransaction transaction)
    {
        try
        {
            long galleryId = await connection.QueryFirstOrDefaultAsync<long>("INSERT INTO Gallery (Title, CreationUserId, CreatedAt)" +
                                                                           "OUTPUT INSERTED.Id " +
                                                                           " VALUES (@Title, @CreationUserId, @CreatedAt)", gallery, transaction);
            return galleryId;
        }
        catch
        {
            throw new Exception("Erro ao salvar galeria");
        }

    }
    public async Task<Gallery?> GetByIdAsync(long id)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            var gallery = await connection.QueryFirstOrDefaultAsync<Gallery>(
                "SELECT * FROM Gallery WHERE Id = @Id AND DeletedAt IS NULL",
                new { Id = id });

            return gallery;
        }
        catch
        {
            throw;
        }
    }

    public async Task UpdateGalleryAsync(Gallery gallery, IDbConnection connection, IDbTransaction transaction)
    {
        try
        {
            string sql = @"UPDATE Gallery SET Title = @Title, CreationUserId = @CreationUserId WHERE Id = @Id;";

            var updateGallery = new
            {
                gallery.Title,
                gallery.CreationUserId,
                gallery.Id
            };

            await connection.ExecuteAsync(sql, updateGallery, transaction);
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao atualizar galeria", ex);
        }
    }

    public async Task DeleteGalleryAsync(long id)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            string query = @"
            UPDATE Gallery
            SET DeletedAt = @DeletedAt
            WHERE Id = @Id";

            await connection.ExecuteAsync(query, new
            {
                Id = id,
                DeletedAt = DateTime.Now
            });

        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao deletar galeria", ex);
        }
    }

    public async Task<List<Gallery>> GetAllAsync()
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            var galleries = await connection.QueryAsync<Gallery>(
                "SELECT * FROM Gallery WHERE DeletedAt IS NULL");

            return galleries.ToList();
        }
        catch (Exception)
        {
            throw;
        }
    }
}
