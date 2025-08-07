using APIStartUFC.Core.Entities;
using System.Data;

namespace APIStartUFC.Infrastructure.Interfaces;

public interface ISupporterRepository
{
    public Task<long> SaveNewSupporterAsync(Supporter supporter, IDbConnection connection, IDbTransaction transaction);
    public Task<Supporter?> GetByIdAsync(long id);
    public Task DeleteSupporterAsync(long id);
    public Task UpdateSupporterAsync(Supporter supporter, IDbConnection connection, IDbTransaction transaction);
    public Task<List<Supporter>> GetAllAsync();
}
