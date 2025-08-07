namespace APIStartUFC.Shared.Entities;

public class Settings
{
    public IDictionary<string, string> ConnectionStrings { get; set; }
    public string ImageDirectoryPath { get; set; }
    public string JwtSecret { get; set; }
    public long JwtExpirationTime { get; set; }
    public string MailServiceDefault { get; set; }
    public string MailServicePassword { get; set; }
}
