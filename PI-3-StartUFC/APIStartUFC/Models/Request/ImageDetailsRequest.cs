using System.ComponentModel.DataAnnotations;

namespace APIStartUFC.WebApi.Models.Request;

public class ImageDetailsRequest
{
    [Required(ErrorMessage = "O campo Base64 é obrigatório.")]
    public string Base64 { get; set; }

    [Required(ErrorMessage = "A extensão é obrigatória.")]
    [RegularExpression(@"^\.(jpg|jpeg|png|gif|bmp)$",
        ErrorMessage = "Extensão in´válida: Verifique se está sendo passado o "+"."+" antes do nome da extensão. Extensões aceitas: .jpg, .jpeg, .png, .gif ou .bmp.")]
    public string Extension { get; set; }
}
