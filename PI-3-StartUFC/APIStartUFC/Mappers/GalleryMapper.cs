using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.WebApi.Models.Request;

namespace APIStartUFC.WebApi.Mappers;

public class GalleryMapper
{
    public static SaveGalleryRequestDTO MapSaveGalleryRequestToDTO(SaveGalleryRequest galleryRequest)
    {
        return new SaveGalleryRequestDTO
        {
            Title = galleryRequest.Title,
            ImageDetails = galleryRequest.ImageDetails.Select(ImageDetails => new ImageDetailsDTO
            {
                Base64 = ImageDetails.Base64,
                Extension = ImageDetails.Extension.ToLowerInvariant(),
            }).ToList(),
            UserId = galleryRequest.UserId,
        };
    }
    public static UpdateGalleryRequestDTO MapUpdateGalleryRequestToDTO(UpdateGalleryRequest galleryRequest)
    {
        return new UpdateGalleryRequestDTO
        {
            Id = galleryRequest.Id,
            Title = galleryRequest.Title,
            ImageDetails = galleryRequest.ImageDetails.Select(ImageDetails => new ImageDetailsDTO
            {
                Base64 = ImageDetails.Base64,
                Extension = ImageDetails.Extension.ToLowerInvariant(),
            }).ToList(),
            DeletedImages = galleryRequest.DeletedImages,
            UserId = galleryRequest.UserId,
        };
    }
}
