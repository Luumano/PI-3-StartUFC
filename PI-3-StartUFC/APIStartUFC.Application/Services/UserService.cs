using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.Application.DTOs.Result;
using APIStartUFC.Application.Interfaces;
using APIStartUFC.Application.Validators;
using APIStartUFC.Core.Entities;
using APIStartUFC.Infrastructure.Interfaces;
using APIStartUFC.Infrastructure.Services;
using APIStartUFC.Shared.Entities;
using APIStartUFC.Shared.Utils;

namespace APIStartUFC.Application.Services;

public class UserService : IUserService
{
    private readonly Settings _settings;
    private readonly UserValidator _userValidator;
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository, Settings settings)
    {
        _settings = settings;
        _userRepository = userRepository;
        _userValidator = new UserValidator();
    }

    public async Task SaveUserAsync(SaveUserRequestDTO dto)
    {
        _userValidator.SaveUserValidate(dto);

        try
        {
            object? existingUser = await _userRepository.GetByEmailAsync(dto.Email);

            if (existingUser != null)
            {
                throw new InvalidOperationException("Já existe um usuário cadastrado com este e-mail.");
            }

            string passwordSalt = PasswordHasher.GenerateSalt();
            string passwordHash = PasswordHasher.HashPassword(dto.Password, passwordSalt);

            User newUser = User.Create(
                                       dto.Name,
                                       dto.Email,
                                       dto.Cpf,
                                       dto.Phone,
                                       passwordHash,
                                       passwordSalt,
                                       dto.IsAdmin
                                      );

            await _userRepository.SaveNewUserAsync(newUser);
        }
        catch (InvalidOperationException ex)
        {
            throw new ApplicationException($"Erro ao salvar usuário: {ex.Message}", ex);
        }
        catch (Exception ex)
        {
            throw new ApplicationException("Ocorreu um erro inesperado ao salvar o usuário.", ex);
        }
    }

    public async Task<GetUserByIdResponseDTO?> GetByIdAsync(long id)
    {
        try
        {
            User? user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return null;
            }

            return new GetUserByIdResponseDTO
            {
                Name = user.Name,
                Email = user.Email,
                Cpf = user.Cpf,
                Phone = user.Phone,
                IsAdmin = user.IsAdmin,
            };
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<bool> DeleteUserAsync(long id)
    {
        try
        {
            User? user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return false;
            }

            await _userRepository.DeleteUserAsync(id);

            return true;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task UpdateUserAsync(UpdateUserRequestDTO dto)
    {
        _userValidator.UpdateUserValidate(dto);

        try
        {
            User? user = await _userRepository.GetByIdAsync(dto.Id);

            if (user == null)
            {
                throw new KeyNotFoundException($"Usuário não encontrado.");
            }

            user.Name = dto.Name;
            user.Email = user.Email;
            user.Phone = dto.Phone;

            await _userRepository.UpdateUserAsync(user);
        }
        catch (Exception)
        {
            throw;
        }
    }

    //public async Task ChangePasswordAsync(ChangePasswordRequestDTO dto)
    //{
    //    try
    //    {
    //        var user = await _userRepository.GetByIdAsync(dto.UserId);

    //        if (user == null)
    //            throw new Exception("Usuário não encontrado");

    //        if (user.Password != dto.CurrentPassword)
    //            throw new Exception("Senha incorreta");

    //        await _userRepository.ChangePasswordAsync(user.Id, dto.NewPassword);
    //    }
    //    catch (Exception ex)
    //    {
    //        throw new Exception($"Não foi possível alterar a senha");

    //    }
    //}

    public async Task ChangePasswordAsync(ChangePasswordRequestDTO dto)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(dto.UserId);

            if (user == null)
                throw new Exception("Usuário não encontrado");

            bool correctPassword = PasswordHasher.VerifyPassword(dto.CurrentPassword, user.PasswordSalt, user.PasswordHash);

            if (!correctPassword)
                throw new Exception("Senha incorreta");

            string novoSalt = PasswordHasher.GenerateSalt();
            string novoHash = PasswordHasher.HashPassword(dto.NewPassword, novoSalt);

            await _userRepository.ChangePasswordAsync(user.Id, novoHash, novoSalt);
        }
        catch (Exception)
        {
            throw new Exception("Não foi possível alterar a senha");
        }
    }

    //public async Task ResetPassword(ResetPasswordRequestDTO dto)
    //{
    //    try
    //    {
    //        User? user = await _userRepository.GetByEmailAsync(dto.Email);

    //        if (user == null)
    //            throw new Exception("Usuário não encontrado");

    //        string newPassword = PasswordHandler.GenerateRandomPassword();

    //        user.Password = newPassword;

    //        await _userRepository.UpdateUserAsync(user);

    //        new MailService(_settings).SendMail(user.Email, "Senha Temporária", $"{user.Name}, segue sua senha temporária: {newPassword}");
    //    }
    //    catch (Exception)
    //    {
    //        throw new Exception("Não foi possível realizar o resete de senha");
    //    }
    //}

    public async Task ResetPassword(ResetPasswordRequestDTO dto)
    {
        try
        {
            User? user = await _userRepository.GetByEmailAsync(dto.Email);

            if (user == null)
                throw new Exception("Usuário não encontrado");

            string newPasswordReset = PasswordHandler.GenerateRandomPassword();

            string newSalt = PasswordHasher.GenerateSalt();
            string newHash = PasswordHasher.HashPassword(newPasswordReset, newSalt);

            user.PasswordHash = newHash;
            user.PasswordSalt = newSalt;

            await _userRepository.UpdateUserAsync(user);

            new MailService(_settings).SendMail(
                user.Email,
                "Redefinição de Senha - StartUFC",
                $"{user.Name}," +
                "\r\n\r\nVocê solicitou a redefinição da sua senha." +
                $"\r\n\r\nAqui está sua nova senha de acesso: {newPasswordReset}" +
                "\r\n\r\nPor segurança, recomendamos que você faça login e altere essa senha assim que possível." +
                "\r\n\r\nCaso não tenha solicitado essa alteração, entre em contato com o suporte." +
                "\r\n\r\nAtenciosamente," +
                "\r\nEquipe StartUFC"
                );

        }
        catch (Exception)
        {
            throw new Exception("Não foi possível realizar o resete de senha");
        }
    }

}
