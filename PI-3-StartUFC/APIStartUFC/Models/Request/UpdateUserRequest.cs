namespace APIStartUFC.WebApi.Models.Request;

public class UpdateUserRequest
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
}
