namespace APIStartUFC.Application.DTOs.Result;

public class GetUserByIdResponseDTO
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Cpf { get; set; }
    public bool IsAdmin { get; set; }
}
