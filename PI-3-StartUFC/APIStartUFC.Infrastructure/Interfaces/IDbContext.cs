using System.Data;

namespace APIStartUFC.Infrastructure.Interfaces;

public interface IDbContext
{
    public IDbConnection CreateConnection();
}
