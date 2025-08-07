
using APIStartUFC.src.Core.Entities;
using System.Data;

namespace APIStartUFC.Infrastructure.Interfaces;

public interface INewsRepository
{
    public Task<long> SaveNewsAsync(News news, IDbConnection connection, IDbTransaction transaction);
    public Task<News?> GetByIdAsync(long id);
    public Task DeleteNewsAsync(long id);
    public Task UpdateNewsAsync(News news, IDbConnection connection, IDbTransaction transaction);
    public Task<List<News>> GetAllAsync();
    public Task<IEnumerable<News>> GetByTitleAsync(string term);
}
