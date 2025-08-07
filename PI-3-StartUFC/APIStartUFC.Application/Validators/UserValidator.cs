using APIStartUFC.Application.DTOs.Request;

namespace APIStartUFC.Application.Validators;

public class UserValidator
{
    public bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public void SaveUserValidate(SaveUserRequestDTO dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new Exception("O nome é obrigatório.");

        if (dto.Name.Length < 3 || dto.Name.Length > 80)
            throw new Exception("O nome deve ter entre 3 e 80 caracteres.");

        if (string.IsNullOrWhiteSpace(dto.Email))
            throw new Exception("O e-mail é obrigatório.");

        if (!IsValidEmail(dto.Email))
            throw new Exception("O e-mail informado não é válido.");

        if (dto.IsAdmin == null)
            throw new Exception("O campo IsAdmin é obrigatório e deve ser verdadeiro ou falso.");

        if (string.IsNullOrWhiteSpace(dto.Password))
            throw new Exception("A senha é obrigatória.");

        if (dto.Password.Length < 6 || dto.Password.Length > 20)
            throw new Exception("A senha deve ter entre 6 e 20 caracteres.");

        if (dto.Password.Any(char.IsWhiteSpace))
            throw new Exception("A senha não pode conter espaços em branco.");

        if (!dto.Password.Any(char.IsUpper) || !dto.Password.Any(char.IsLower) || !dto.Password.Any(char.IsDigit))
            throw new Exception("A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um dígito numérico.");

        if (dto.Password.Contains(dto.Name, StringComparison.OrdinalIgnoreCase))
            throw new Exception("A senha não pode conter o nome do usuário.");
    }

    public void UpdateUserValidate(UpdateUserRequestDTO dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new Exception("O nome é obrigatório.");

        if (dto.Name.Length < 3 || dto.Name.Length > 150)
            throw new Exception("O nome deve ter entre 3 e 150 caracteres.");

        if (string.IsNullOrWhiteSpace(dto.Email))
            throw new Exception("O e-mail é obrigatório.");

        if (!IsValidEmail(dto.Email))
            throw new Exception("O e-mail informado não é válido.");

    }
}
