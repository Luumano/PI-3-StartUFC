using APIStartUFC.Application.DTOs.Request;

namespace APIStartUFC.Application.Validators;

public class NewsValidator
{
    public void SaveNewsValidator(SaveNewsRequestDTO dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new Exception("O Título da notícia é obrigatório.");

        if (dto.Title.Length < 3 || dto.Title.Length > 150)
            throw new Exception("O Título da notícia deve ter entre 3 e 150 caracteres.");

        if (string.IsNullOrWhiteSpace(dto.Content))
            throw new Exception("O conteúdo da notícia é obrigatória.");

        if (dto.Content.Length > 4000)
            throw new Exception("O conteúdo da notícia deve ter até 4000 caracteres.");
    }

    public void UpdateNewsValidator(UpdateNewsRequestDTO dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new Exception("O Título da notícia é obrigatório.");

        if (dto.Title.Length < 3 || dto.Title.Length > 150)
            throw new Exception("O Título da notícia deve ter entre 3 e 150 caracteres.");

        if (string.IsNullOrWhiteSpace(dto.Content))
            throw new Exception("O conteúdo da notícia é obrigatória.");

        if (dto.Content.Length > 4000)
            throw new Exception("O conteúdo da notícia deve ter até 4000 caracteres.");
    }
}
