using APIStartUFC.Core.Entities;

namespace APIStartUFC.Infrastructure.Interfaces;

public interface IUserEventRepository
{
    public Task<string> SaveUserEventAsync(UserEvent UserEvent);

    public Task<List<UserEvent>> GetUserEventsByEventIdAsync(long eventId);

    public Task<int> GetEnrollmentCountByEventIdAsync(long eventId);

    public Task<bool> IsUserEnrolledInEventAsync(long eventId, long userId);

    public Task DeleteUserEventAsync(string enrollmentId);
}
