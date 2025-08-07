using APIStartUFC.Infrastructure.Interfaces;
using APIStartUFC.src.Core.Entities;
using Dapper;
using System.Data;

namespace APIStartUFC.Infrastructure.Repositories;

public class NewsRepository : INewsRepository
{
    private readonly IDbContext _dbContext;

    public NewsRepository(IDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<long> SaveNewsAsync(News news, IDbConnection connection, IDbTransaction transaction)
    {
        try
        {
            long newsId = await connection.QueryFirstOrDefaultAsync<long>("INSERT INTO News (Title, Content, CreationUserId, CreatedAt) " +
                                        "OUTPUT INSERTED.Id " +
                                        "VALUES(@Title, @Content, @CreationUserId, @CreatedAt)", news, transaction);
            return newsId;
        }
        catch
        {
            throw new Exception("Erro ao salvar Notícia");
        }
    }

    public async Task<News?> GetByIdAsync(long id)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            var news = await connection.QueryFirstOrDefaultAsync<News>(
                "SELECT * FROM News WHERE Id = @Id AND DeletedAt IS NULL",
                new { Id = id });

            return news;
        }
        catch (Exception ex)
        {
            throw;
        }
    }

    public async Task UpdateNewsAsync(News news, IDbConnection connection, IDbTransaction transaction)
    {
        try
        {
             string sql = @"UPDATE News SET Title = @Title, Content = @Content, CreationUserId = @CreationUserId, CreatedAt = @CreatedAt WHERE Id = @Id;";

            var updateNews = new
            {
                news.Title,
                news.Content,
                news.CreationUserId,
                news.CreatedAt,
                news.Id
            };

            await connection.ExecuteAsync(sql, updateNews, transaction);
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao atualizar notícia", ex);
        }
    }

    public async Task DeleteNewsAsync(long id)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            string query = @"
            UPDATE News
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
            throw new Exception("Erro ao deletar notícia", ex);
        }
    }

    public async Task<List<News>> GetAllAsync()
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            var newsList = await connection.QueryAsync<News>(
                "SELECT * FROM News WHERE DeletedAt IS NULL");

            return newsList.ToList();
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IEnumerable<News>> GetByTitleAsync(string term)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            var newsList = await connection.QueryAsync<News>(
                "SELECT * FROM News WHERE Title LIKE @Term AND DeletedAt IS NULL",
                new { Term = "%" + term + "%" });

            return newsList;
        }
        catch (Exception)
        {
            throw;
        }
    }
}
