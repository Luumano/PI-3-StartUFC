
using APIStartUFC.Core.Entities;

namespace APIStartUFC.Infrastructure.Interfaces;
public interface IUserRepository
{
    public Task SaveNewUserAsync(User user);
    public Task<User?> GetByIdAsync(long id);
    public Task DeleteUserAsync(long id);
    public Task UpdateUserAsync(User user);
    public Task<User?> GetByEmailAsync(string email);
    // public Task ChangePasswordAsync(long userId, string newPassword);
    public Task ChangePasswordAsync(long userId, string newPasswordHash, string newPasswordSalt);
}

