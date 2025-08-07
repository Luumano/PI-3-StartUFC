using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.WebApi.Models.Request;

namespace APIStartUFC.WebApi.Mappers;

public class UserMapper
{
    public static SaveUserRequestDTO MapSaveUserRequestToDTO(SaveUserRequest userRequest)
    {
        return new SaveUserRequestDTO
        {
            Name = userRequest.Name,
            Email = userRequest.Email,
            Cpf = userRequest.Cpf,
            Phone = userRequest.Phone,
            IsAdmin = userRequest.IsAdmin,
            Password = userRequest.Password
        };
    }

    public static UpdateUserRequestDTO MapUpdateUserRequestToDTO(UpdateUserRequest userRequest)
    {
        return new UpdateUserRequestDTO
        {
            Id = userRequest.Id,
            Name = userRequest.Name,
            Email = userRequest.Email,
            Phone = userRequest.Phone
        };
    }

    public static ResetPasswordRequestDTO MapResetPasswordRequestToDTO(ResetPasswordRequest resetPasswordRequest)
    {
        return new ResetPasswordRequestDTO
        {
            Email = resetPasswordRequest.Email
        };
    }

    public static ChangePasswordRequestDTO MapChangePasswordRequestToDTO(ChangePasswordRequest changePasswordRequest, long userId)
    {
        return new ChangePasswordRequestDTO
        {
            UserId = userId,
            CurrentPassword = changePasswordRequest.CurrentPassword,
            NewPassword = changePasswordRequest.NewPassword,
            ConfirmNewPassword = changePasswordRequest.ConfirmNewPassword
        };
    }
}
