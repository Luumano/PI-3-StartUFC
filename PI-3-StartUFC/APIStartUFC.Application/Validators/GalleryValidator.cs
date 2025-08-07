using APIStartUFC.Application.DTOs.Request;

namespace APIStartUFC.Application.Validators;

public class GalleryValidator
{
    public void SaveGalleryValidator(SaveGalleryRequestDTO dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new Exception("O Título da galeria é obrigatório.");

        if (dto.Title.Length < 3 || dto.Title.Length > 50)
            throw new Exception("O Título da galeria deve ter entre 3 e 150 caracteres.");
    }

    public void UpdateGalleryValidator(UpdateGalleryRequestDTO dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new Exception("O Título da galeria é obrigatório.");

        if (dto.Title.Length < 3 || dto.Title.Length > 50)
            throw new Exception("O Título da galeria deve ter entre 3 e 150 caracteres.");
    }
}
