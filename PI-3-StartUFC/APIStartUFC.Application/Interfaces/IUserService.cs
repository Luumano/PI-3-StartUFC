using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.Application.DTOs.Result;

namespace APIStartUFC.Application.Interfaces;

public interface IUserService
{
    public Task SaveUserAsync(SaveUserRequestDTO dto);
    public Task<GetUserByIdResponseDTO?> GetByIdAsync(long id);
    public Task<bool> DeleteUserAsync(long id);
    public Task UpdateUserAsync(UpdateUserRequestDTO dto);
    public Task ResetPassword(ResetPasswordRequestDTO dto);
    public Task ChangePasswordAsync(ChangePasswordRequestDTO dto);
}

