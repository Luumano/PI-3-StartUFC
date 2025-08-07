using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.WebApi.Models.Request;

namespace APIStartUFC.WebApi.Mappers;

public class SupporterMapper
{
    public static SaveSupporterRequestDTO MapSaveSupporterRequestToDTO(SaveSupporterRequest supporterRequest)
    {
        return new SaveSupporterRequestDTO
        {
            Name = supporterRequest.Name,
            Description = supporterRequest.Description,
            ImageDetails = supporterRequest.ImageDetails.Select(ImageDetails => new ImageDetailsDTO
            {
                Base64 = ImageDetails.Base64,
                Extension = ImageDetails.Extension.ToLowerInvariant(),
            }).ToList(),
            UserId = supporterRequest.UserId,
        };
    }

    public static UpdateSupporterRequestDTO MapUpdateSupporterRequestToDTO(UpdateSupporterRequest supporterRequest)
    {
        return new UpdateSupporterRequestDTO
        {
            Id = supporterRequest.Id,
            Name = supporterRequest.Name,
            Description = supporterRequest.Description,
            ImageDetails = supporterRequest.ImageDetails.Select(ImageDetails => new ImageDetailsDTO
            {
                Base64 = ImageDetails.Base64,
                Extension = ImageDetails.Extension.ToLowerInvariant(),
            }).ToList(),
            DeletedImages = supporterRequest.DeletedImages,
            UserId = supporterRequest.UserId,
        };
    }
}
