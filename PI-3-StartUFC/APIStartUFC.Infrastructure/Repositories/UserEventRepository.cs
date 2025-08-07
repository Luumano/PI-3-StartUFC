using APIStartUFC.Core.Entities;
using APIStartUFC.Infrastructure.Interfaces;
using Dapper;

namespace APIStartUFC.Infrastructure.Repositories;

public class UserEventRepository : IUserEventRepository
{
    private readonly IDbContext _dbContext;

    public UserEventRepository(IDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<string> SaveUserEventAsync(UserEvent UserEvent)
    {
        try
        {
            using var connection = _dbContext.CreateConnection();

            string? identifier = await connection.QueryFirstOrDefaultAsync<string>(
                                                                                   "INSERT INTO UserEvent (EventId, UserId, Identifier, CreationUserId, CreatedAt) " +
                                                                                   "OUTPUT INSERTED.Identifier " + "VALUES (@EventId, @UserId, @Identifier, @CreationUserId, @CreatedAt)", UserEvent);

            return identifier;
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao salvar inscrição no evento", ex);
        }
    }

    public async Task<List<UserEvent>> GetUserEventsByEventIdAsync(long eventId)
    {
        try
        {
            using var connection = _dbContext.CreateConnection();
            IEnumerable<UserEvent> enrollments = await connection.QueryAsync<UserEvent>(
                "SELECT * FROM UserEvent WHERE EventId = @EventId AND DeletedAt IS NULL", new { EventId = eventId });
            return enrollments.ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao obter inscrições do evento", ex);
        }
    }

    public async Task<int> GetEnrollmentCountByEventIdAsync(long eventId)
    {
        try
        {
            using var connection = _dbContext.CreateConnection();

            int count = await connection.ExecuteScalarAsync<int>(
                "SELECT COUNT(*) FROM UserEvent WHERE EventId = @EventId AND DeletedAt IS NULL", new { EventId = eventId });

            return count;
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao obter contagem de inscrições do evento", ex);
        }
    }

    public async Task<bool> IsUserEnrolledInEventAsync(long eventId, long userId)
    {
        try
        {
            using var connection = _dbContext.CreateConnection();
            int count = await connection.ExecuteScalarAsync<int>(
                "SELECT COUNT(*) FROM UserEvent WHERE EventId = @EventId AND UserId = @UserId AND DeletedAt IS NULL",
                new { EventId = eventId, UserId = userId });
            return count > 0;
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao verificar inscrição do usuário no evento", ex);
        }
    }

    public async Task DeleteUserEventAsync(string enrollmentId)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            string query = @"
            UPDATE UserEvent
            SET DeletedAt = @DeletedAt
            WHERE Id = @Id";

            await connection.ExecuteAsync(query, new
            {
                Id = enrollmentId,
                DeletedAt = DateTime.Now
            });

        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao excluir inscrição do evento", ex);
        }
    }
}

