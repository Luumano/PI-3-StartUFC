using APIStartUFC.WebApi.Models.Request;

namespace APIStartUFC.WebApi.Validator;

public class ChangePasswordRequestValidator
{
    public void Validate(ChangePasswordRequest req)
    {
        if (req.NewPassword != req.ConfirmNewPassword)
            throw new Exception("A nova senha e a confirmação não são iguais");

        if (string.IsNullOrWhiteSpace(req.CurrentPassword))
            throw new Exception("A senha atual é obrigatória.");

        if (string.IsNullOrWhiteSpace(req.NewPassword))
            throw new Exception("A nova senha é obrigatória.");

        if (req.NewPassword.Length < 6 || req.NewPassword.Length > 20)
            throw new Exception("A nova senha deve ter entre 6 e 20 caracteres.");

        if (req.NewPassword.Any(char.IsWhiteSpace))
            throw new Exception("A nova senha não pode conter espaços em branco.");

        if (!req.NewPassword.Any(char.IsUpper) || !req.NewPassword.Any(char.IsLower) || !req.NewPassword.Any(char.IsDigit))
            throw new Exception("A nova senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um dígito numérico.");

    }

}
