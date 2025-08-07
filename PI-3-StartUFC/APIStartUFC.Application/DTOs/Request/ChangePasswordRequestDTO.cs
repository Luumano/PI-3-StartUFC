namespace APIStartUFC.Application.DTOs.Request;

public class ChangePasswordRequestDTO
{
    public long UserId { get; set; }
    public string CurrentPassword { get; set; }
    public string NewPassword { get; set; }
    public string ConfirmNewPassword { get; set; }
}
