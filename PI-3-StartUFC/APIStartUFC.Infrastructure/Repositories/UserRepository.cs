using APIStartUFC.Core.Entities;
using APIStartUFC.Infrastructure.Interfaces;
using Dapper;

namespace APIStartUFC.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IDbContext _dbContext;

    public UserRepository(IDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    //public async Task SaveNewUserAsync(User user)
    //{
    //    try
    //    {
    //        var connection = _dbContext.CreateConnection();

    //        string sql = @"
    //            INSERT INTO [User] 
    //                (Name, Email, IsAdmin, Cpf, Phone, Password, [Hash], CreationUserId, CreatedAt) 
    //            VALUES 
    //                (@Name, @Email, @IsAdmin, @Cpf, @Phone, @Password, @Hash, @CreationUserId, @CreatedAt)";

    //        await connection.QueryAsync(sql, user);
    //    }
    //    catch (Exception ex)
    //    {
    //        throw new Exception("Erro ao salvar usuário", ex);
    //    }

    //}

    public async Task SaveNewUserAsync(User user)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            string sql = @"
            INSERT INTO [User] 
                (Name, Email, IsAdmin, Cpf, Phone, PasswordHash, PasswordSalt, CreationUserId, CreatedAt) 
            VALUES 
                (@Name, @Email, @IsAdmin, @Cpf, @Phone, @PasswordHash, @PasswordSalt, @CreationUserId, @CreatedAt)";

            await connection.QueryAsync(sql, user);
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao salvar usuário", ex);
        }
    }


    public async Task<User?> GetByIdAsync(long id)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            var user = await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM [User] WHERE Id = @Id AND DeletedAt IS NULL",

                new { Id = id });

            return user;
        }
        catch (Exception ex)
        {
            throw;
        }
    }

    public async Task UpdateUserAsync(User user)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            string sql = @"
                UPDATE
                    [User]
                SET 
                    Name = @Name, Email = @Email, IsAdmin = @IsAdmin, Cpf =  @Cpf, Phone = @Phone, PasswordHash = @PasswordHash, PasswordSalt = @PasswordSalt, CreationUserId = @CreationUserId, CreatedAt = @CreatedAt
                WHERE 
                    Id = @Id";

            await connection.QueryAsync(sql, user);
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao atualizar usuário", ex);
        }
    }

    public async Task DeleteUserAsync(long id)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            string query = @"
            UPDATE [User]
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
            throw new Exception("Erro ao deletar usuário", ex);
        }
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            var user = await connection.QueryFirstOrDefaultAsync<User>("SELECT * FROM [User] WHERE Email = @Email AND DeletedAt IS NULL", new { Email = email });

            return user;
        }
        catch
        {
            return null;
        }
    }

    //public async Task ChangePasswordAsync(long userId, string newPassword)
    //{
    //    try
    //    {
    //        var connection = _dbContext.CreateConnection();

    //        string sql = @"
    //        UPDATE 
    //            [User]
    //        SET 
    //            Password = @Password
    //        WHERE 
    //            Id = @Id";

    //        var parameters = new { Id = userId, Password = newPassword };

    //        await connection.ExecuteAsync(sql, parameters);
    //    }
    //    catch (Exception ex)
    //    {
    //        throw new Exception("Erro ao atualizar a senha do usuário", ex);
    //    }
    //}
    public async Task ChangePasswordAsync(long userId, string newPasswordHash, string newPasswordSalt)
    {
        try
        {
            var connection = _dbContext.CreateConnection();

            string sql = @"
            UPDATE [User]
            SET 
                PasswordHash = @PasswordHash,
                PasswordSalt = @PasswordSalt
            WHERE 
                Id = @Id";

            var parameters = new
            {
                Id = userId,
                PasswordHash = newPasswordHash,
                PasswordSalt = newPasswordSalt
            };

            await connection.ExecuteAsync(sql, parameters);
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao atualizar a senha do usuário", ex);
        }
    }

}
