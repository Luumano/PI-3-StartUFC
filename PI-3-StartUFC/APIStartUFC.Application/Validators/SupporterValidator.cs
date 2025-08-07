using APIStartUFC.Application.DTOs.Request;

namespace APIStartUFC.Application.Validators;

public class SupporterValidator
{
    public void SaveSupporterValidate(SaveSupporterRequestDTO dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new Exception("O nome do apoiador é obrigatório.");

        if (string.IsNullOrWhiteSpace(dto.Description))
            throw new Exception("A descrição do apoiador é obrigatória.");

        if (dto.Name.Length < 3 || dto.Name.Length > 150)
            throw new Exception("O nome do apoiador deve ter entre 3 e 150 caracteres.");

        if (dto.Description.Length > 1500)
            throw new Exception("A descrição do apoiador deve ter até 1500 caracteres.");
    }
   
    public void UpdateSupporterValidate(UpdateSupporterRequestDTO dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new Exception("O nome do apoiador é obrigatório.");

        if (string.IsNullOrWhiteSpace(dto.Description))
            throw new Exception("A descrição do apoiador é obrigatória.");

        if (dto.Name.Length < 3 || dto.Name.Length > 150)
            throw new Exception("O nome do apoiador deve ter entre 3 e 150 caracteres.");

        if (dto.Description.Length > 1500)
            throw new Exception("A descrição do apoiador deve ter até 1500 caracteres.");
    }

}
