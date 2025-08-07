using APIStartUFC.Infrastructure.Interfaces;
using APIStartUFC.src.Core.Entities;
using Dapper;
using System.Data;

namespace APIStartUFC.Infrastructure.Repositories;

public class EventRepository : IEventRepository
{
    private readonly IDbContext _dbContext;

    public EventRepository(IDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<long> SaveNewEventAsync(Event @event, IDbConnection connection, IDbTransaction transaction)
    {
        try
        {
            long eventId = await connection.QueryFirstOrDefaultAsync<long>(
                                        "INSERT INTO [Event] ([Name], [Description], StartTime, EndTime, [Date], Place, Capacity, CreationUserId, CreatedAt) " +
                                        "OUTPUT INSERTED.Id " +
                                        "VALUES (@Name, @Description, @StartTime, @EndTime, @Date, @Place, @Capacity, @CreationUserId, @CreatedAt)", @event, transaction);

            return eventId;
        }
        catch
        {
            throw new Exception("Erro ao salvar evento");
        }
    }

    public async Task<Event?> GetByIdAsync(long id)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            var @event = await connection.QueryFirstOrDefaultAsync<Event>(
                                                                         "SELECT * FROM [Event] WHERE [Id] = @Id AND DeletedAt IS NULL",
                                                                         new { Id = id });

            return @event;
        }
        catch
        {
            throw;
        }
    }

    public async Task UpdateEventAsync(Event @event, IDbConnection connection, IDbTransaction transaction)
    {
        try
        {
            string sql = @"UPDATE Event SET Name = @Name,Description = @Description, StartTime = @StartTime, EndTime = @EndTime, Date = @Date,
                         Place = @Place, Capacity = @Capacity, CreationUserId = @CreationUserId, CreatedAt = @CreatedAt WHERE Id = @Id;";

            var updateEvent = new
            {
                @event.Name,
                @event.Description,
                @event.StartTime,
                @event.EndTime,
                @event.Date,
                @event.Place,
                @event.Capacity,
                @event.CreationUserId,
                @event.CreatedAt,
                @event.Id
            };

            await connection.ExecuteAsync(sql, updateEvent, transaction);
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao atualizar evento", ex);
        }
    }

    public async Task DeleteEventAsync(long id)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            string query = @"
            UPDATE Event
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
            throw new Exception("Erro ao deletar evento", ex);
        }
    }

    public async Task<List<Event>> GetEventListByUserId(long userId)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            IEnumerable<Event> eventList = await connection.QueryAsync<Event>(
                                                           "SELECT E.* FROM [Event] E " +
                                                           "INNER JOIN UserEvent UE ON E.Id = UE.EventId " +
                                                           "INNER JOIN [User] U ON UE.UserId = U.Id " +
                                                           "WHERE U.Id = @Id",
                                                           new { Id = userId });

            return eventList.ToList();
        }
        catch (Exception)
        {

            throw;
        }
    }

    public async Task<List<Event>> GetAllAsync()
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            var events = await connection.QueryAsync<Event>(
                "SELECT * FROM Event WHERE DeletedAt IS NULL");

            return events.ToList();
        }
        catch (Exception)
        {
            throw;
        }
    }
}
