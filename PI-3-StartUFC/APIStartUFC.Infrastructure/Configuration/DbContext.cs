using APIStartUFC.Infrastructure.Interfaces;
using APIStartUFC.Shared.Entities;
using System.Data;
using System.Data.SqlClient;

namespace APIStartUFC.Infrastructure.Configuration;

public class DbContext : IDbContext
{
    private readonly Settings _settings;

    public DbContext(Settings settings)
    {
        _settings = settings;
    }

    public IDbConnection CreateConnection()
    {
        var connection = new SqlConnection(_settings.ConnectionStrings["DefaultConnection"]);

        return connection;
    }
}
