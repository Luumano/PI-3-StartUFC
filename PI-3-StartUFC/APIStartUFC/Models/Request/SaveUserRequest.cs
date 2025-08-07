namespace APIStartUFC.WebApi.Models.Request;

public class SaveUserRequest
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Cpf { get; set; }
    public bool IsAdmin { get; set; }
    public string Password { get; set; }
}
