using APIStartUFC.Infrastructure.Interfaces;
using System.Data;

namespace APIStartUFC.Infrastructure.Configuration;
public class UnitOfWork : IUnitOfWork
{
    private readonly IDbContext _dbContext;
    public IDbConnection Connection { get; private set; }
    public IDbTransaction Transaction { get; private set; }

    public UnitOfWork(IDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public void Begin()
    {
        Connection = _dbContext.CreateConnection();
        Connection.Open();
        Transaction = Connection.BeginTransaction();
    }

    public void Commit()
    {
        if (Transaction != null)
        {
            Transaction.Commit();
        }
    }

    public void Rollback()
    {
        if (Transaction != null)
        {
            Transaction.Rollback();
        }
    }

    public void Dispose()
    {
        Transaction?.Dispose();
        Connection?.Dispose();
    }
}
