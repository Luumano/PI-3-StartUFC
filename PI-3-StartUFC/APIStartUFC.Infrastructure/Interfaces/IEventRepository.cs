using APIStartUFC.src.Core.Entities;
using System.Data;

namespace APIStartUFC.Infrastructure.Interfaces;

public interface IEventRepository
{
    public Task<long> SaveNewEventAsync(Event @event, IDbConnection connection, IDbTransaction transaction);
    public Task<Event?> GetByIdAsync(long id);
    public Task DeleteEventAsync(long id);
    public Task UpdateEventAsync(Event @event, IDbConnection connection, IDbTransaction transaction);
    public Task<List<Event>> GetEventListByUserId(long userId);
    public Task<List<Event>> GetAllAsync();
}
