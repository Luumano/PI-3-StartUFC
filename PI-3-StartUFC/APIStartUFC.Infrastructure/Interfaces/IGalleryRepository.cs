using APIStartUFC.Core.Entities;
using System.Data;

namespace APIStartUFC.Infrastructure.Interfaces;

public interface IGalleryRepository
{
    public Task<long> SaveNewGalleryAsync(Gallery gallery, IDbConnection connection, IDbTransaction transaction);
    public Task<Gallery?> GetByIdAsync(long id);
    public Task DeleteGalleryAsync(long id);
    public Task UpdateGalleryAsync(Gallery gallery, IDbConnection connection, IDbTransaction transaction);
    public Task<List<Gallery>> GetAllAsync();
}
