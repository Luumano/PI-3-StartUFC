namespace APIStartUFC.Application.DTOs.Request;

public class UpdateUserRequestDTO
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
}
