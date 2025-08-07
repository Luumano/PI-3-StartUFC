using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.WebApi.Models.Request;

namespace APIStartUFC.WebApi.Mappers;

public class NewsMapper
{
    public static SaveNewsRequestDTO MapSaveNewsRequestToDTO(SaveNewsRequest newsRequest)
    {
        return new SaveNewsRequestDTO
        {
            Title = newsRequest.Title,
            Content = newsRequest.Content,
            ImageDetails = newsRequest.ImageDetails.Select(ImageDetails => new ImageDetailsDTO
            {
                Base64 = ImageDetails.Base64,
                Extension = ImageDetails.Extension.ToLowerInvariant(),
            }).ToList(),
            UserId = newsRequest.UserId,
        };
    }

    public static UpdateNewsRequestDTO MapUpdateNewsRequestToDTO(UpdateNewsRequest newsRequest)
    {
        return new UpdateNewsRequestDTO
        {
            Id = newsRequest.Id,
            Title = newsRequest.Title,
            Content = newsRequest.Content,
            ImageDetails = newsRequest.ImageDetails.Select(ImageDetails => new ImageDetailsDTO
            {
                Base64 = ImageDetails.Base64,
                Extension = ImageDetails.Extension.ToLowerInvariant(),
            }).ToList(),
            DeletedImages =newsRequest.DeletedImages,
            UserId = newsRequest.UserId,
        };
    }
}
