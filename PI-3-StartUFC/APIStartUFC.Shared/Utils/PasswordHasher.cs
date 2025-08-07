using System.Security.Cryptography;
using System.Text;

public static class PasswordHasher
{
    public static string HashPassword(string password, string salt)
    {
        using (var sha512 = SHA512.Create())
        {
            var combined = password + salt;
            var bytes = Encoding.UTF8.GetBytes(combined);
            var hash = sha512.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }

    public static bool VerifyPassword(string password, string salt, string storedHash)
    {
        var hashOfInput = HashPassword(password, salt);
        return storedHash == hashOfInput;
    }

    public static string GenerateSalt(int size = 16)
    {
        var saltBytes = new byte[size];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(saltBytes);
        }
        return Convert.ToBase64String(saltBytes);
    }
}
