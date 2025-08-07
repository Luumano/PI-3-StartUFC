using APIStartUFC.Core.Entities;
using APIStartUFC.Infrastructure.Interfaces;
using Dapper;
using System.Data;

namespace APIStartUFC.Infrastructure.Repositories;

public class SupporterRepository : ISupporterRepository
{
    private readonly IDbContext _dbContext;

    public SupporterRepository(IDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<long> SaveNewSupporterAsync(Supporter supporter, IDbConnection connection, IDbTransaction transaction)
    {
        try
        {
            long supporterId = await connection.QueryFirstOrDefaultAsync<long>(
                "INSERT INTO Supporter (Name, Description, CreationUserId, CreatedAt) " +
                "OUTPUT INSERTED.Id VALUES (@Name, @Description, @CreationUserId, @CreatedAt)",
                supporter, transaction);
            return supporterId;
        }
        catch
        {
            throw new Exception("Erro ao salvar apoiador");
        }
    }

    public async Task<Supporter?> GetByIdAsync(long id)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            var supporter = await connection.QueryFirstOrDefaultAsync<Supporter>(
                "SELECT * FROM Supporter WHERE Id = @Id AND DeletedAt IS NULL",
                new { Id = id });

            return supporter;
        }
        catch
        {
            throw;
        }
    }

    public async Task UpdateSupporterAsync(Supporter supporter, IDbConnection connection, IDbTransaction transaction)
    {
        try
        {
            const string sql = @"
            UPDATE Supporter 
            SET Name = @Name, 
                Description = @Description, 
                CreationUserId = @CreationUserId 
            WHERE Id = @Id;";

            var updateSupporter = new
            {
                supporter.Name,
                supporter.Description,
                supporter.CreationUserId,
                supporter.Id
            };

            await connection.ExecuteAsync(sql, updateSupporter, transaction);
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao atualizar apoiador", ex);
        }
    }

    public async Task DeleteSupporterAsync(long id)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            string query = @"
            UPDATE Supporter
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
            throw new Exception("Erro ao deletar apoiador", ex);
        }
    }

    public async Task<List<Supporter>> GetAllAsync()
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            var supporters = await connection.QueryAsync<Supporter>(
                "SELECT * FROM Supporter WHERE DeletedAt IS NULL");

            return supporters.ToList();
        }
        catch (Exception)
        {
            throw;
        }
    }
}
