namespace APIStartUFC.Core.Entities;

public class User : BaseEntity
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Cpf { get; set; }
    public string Phone { get; set; }
    public string PasswordHash { get; set; }
    public string PasswordSalt { get; set; }
    public bool IsAdmin { get; set; }


    public static User Create(string name, string email, string cpf, string phone, string passwordHash, string passwordSalt, bool isAdmin)
    {
        return new User
        {
            Name = name,
            Email = email,
            Cpf = cpf,
            Phone = phone,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            IsAdmin = isAdmin
        };
    }
}