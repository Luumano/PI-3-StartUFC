namespace APIStartUFC.Application.DTOs.Request;

public class SaveUserRequestDTO
{
    public string Name { get; set; }
    public string Email { get; set; }
    public bool IsAdmin { get; set; }
    public string Password { get; set; }
    public string Cpf { get; set; }
    public string Phone { get; set; }
}
