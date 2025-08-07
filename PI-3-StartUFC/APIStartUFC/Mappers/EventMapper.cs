using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.WebApi.Models.Request;

namespace APIStartUFC.WebApi.Mappers;

public class EventMapper
{
    public static SaveEventRequestDTO MapSaveEventRequestToDTO(SaveEventRequest eventRequest)
    {
        return new SaveEventRequestDTO
        {
            Name = eventRequest.Name,
            Description = eventRequest.Description,
            StartTime = TimeSpan.Parse(eventRequest.StartTime),
            EndTime = TimeSpan.Parse(eventRequest.EndTime),
            Date = eventRequest.Date,
            Place = eventRequest.Place,
            Capacity = eventRequest.Capacity,
            ImageDetails = eventRequest.ImageDetails.Select(ImageDetails => new ImageDetailsDTO
            {
                Base64 = ImageDetails.Base64,
                Extension = ImageDetails.Extension.ToLowerInvariant(),
            }).ToList(),
            UserId = eventRequest.UserId,
        };
    }

    public static UpdateEventRequestDTO MapUpdateEventRequestToDTO(UpdateEventRequest eventRequest)
    {
        return new UpdateEventRequestDTO
        {
            Id = eventRequest.Id,
            Name = eventRequest.Name,
            Description = eventRequest.Description,
            StartTime = TimeSpan.Parse(eventRequest.StartTime),
            EndTime = TimeSpan.Parse(eventRequest.EndTime),
            Date = eventRequest.Date,
            Place = eventRequest.Place,
            Capacity = eventRequest.Capacity,
            ImageDetails = eventRequest.ImageDetails.Select(ImageDetails => new ImageDetailsDTO
            {
                Base64 = ImageDetails.Base64,
                Extension = ImageDetails.Extension.ToLowerInvariant(),
            }).ToList(),
            DeletedImages = eventRequest.DeletedImages,
            UserId = eventRequest.UserId,
        };
    }

    public static SignUpEventDTO MapSignUpEventRequestToDTO(long userId, long eventId)
    {
        return new SignUpEventDTO
        {            
            UserId = userId,
            EventId = eventId,
        };
    }
}
