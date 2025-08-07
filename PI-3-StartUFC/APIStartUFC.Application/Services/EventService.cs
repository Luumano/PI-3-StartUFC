using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.Application.DTOs.Response;
using APIStartUFC.Application.DTOs.Result;
using APIStartUFC.Application.Interfaces;
using APIStartUFC.Application.Validators;
using APIStartUFC.Core.Entities;
using APIStartUFC.Infrastructure.Interfaces;
using APIStartUFC.Shared.Entities;
using APIStartUFC.Shared.Utils;
using APIStartUFC.src.Core.Entities;
using Microsoft.IdentityModel.Tokens;

namespace APIStartUFC.Application.Services;

public class EventService : IEventService
{
    private readonly Settings _settings;
    private readonly EventValidator _eventValidator;
    private readonly IUserRepository _userRepository;
    private readonly IEventRepository _eventRepository;
    private readonly IUserEventRepository _userEventRepository;
    private readonly IImageRepository _imageRepository;
    private readonly IUnitOfWork _unitOfWork;
    public EventService(Settings settings, IUserRepository userRepository, IEventRepository eventRepository, IImageRepository imageRepository, IUserEventRepository userEventRepository, IUnitOfWork unitOfWork)
    {
        _settings = settings;
        _userRepository = userRepository;
        _eventRepository = eventRepository;
        _imageRepository = imageRepository;
        _userEventRepository = userEventRepository;
        _eventValidator = new EventValidator();
        _unitOfWork = unitOfWork;
    }

    public async Task SaveEventAsync(SaveEventRequestDTO dto)
    {
        _eventValidator.SaveEventValidate(dto);

        _unitOfWork.Begin();
        try
        {
            Event newEvent = Event.Create(dto.Name,
                                            dto.Description,
                                            dto.StartTime,
                                            dto.EndTime,
                                            dto.Date,
                                            dto.Place,
                                            dto.Capacity,
                                            dto.UserId
                                            );

            long newEventId = await _eventRepository.SaveNewEventAsync(newEvent, _unitOfWork.Connection, _unitOfWork.Transaction);

            foreach (ImageDetailsDTO imageDetails in dto.ImageDetails)
            {
                string filename = Guid.NewGuid().ToString();

                Image newImage = Image.Create(filename, imageDetails.Extension, eventId: newEventId);

                await _imageRepository.SaveImage(newImage, _unitOfWork.Connection, _unitOfWork.Transaction);

                ImageHandler.SaveBase64AsImage(imageDetails.Base64, imageDetails.Extension, _settings.ImageDirectoryPath, filename);
            }

            _unitOfWork.Commit();
        }
        catch (Exception)
        {
            _unitOfWork.Rollback();
            throw;
        }
    }

    public async Task<GetEventResponseDTO?> GetByIdAsync(long id)
    {
        try
        {
            Event? @event = await _eventRepository.GetByIdAsync(id);

            if (@event == null)
                return null;

            List<Image> imageList = await _imageRepository.GetImageListByEventId(id);
            List<ImageDetailsDTO> imageListDTO = new List<ImageDetailsDTO>();

            foreach (Image image in imageList)
            {
                string filename = String.Concat(image.Filename, image.Extension);

                string base64 = ImageHandler.ConvertImageToBase64(_settings.ImageDirectoryPath, filename);

                ImageDetailsDTO newImageDetailsDTO = new ImageDetailsDTO
                {
                    Base64 = base64,
                    Extension = image.Extension,
                };
                imageListDTO.Add(newImageDetailsDTO);
            }

            return new GetEventResponseDTO
            {
                Id = @event.Id,
                Name = @event.Name,
                Description = @event.Description,
                Place = @event.Place,
                Capacity = @event.Capacity,
                StartTime = TimeOnly.FromTimeSpan(@event.StartTime),
                EndTime = TimeOnly.FromTimeSpan(@event.EndTime),
                Date = DateOnly.FromDateTime(@event.Date),
                ImageDetails = imageListDTO,

            };
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<bool> DeleteEventAsync(long id)
    {
        try
        {
            Event? @event = await _eventRepository.GetByIdAsync(id);

            if (@event == null)
                return false;

            await _eventRepository.DeleteEventAsync(id);

            return true;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task UpdateEventAsync(UpdateEventRequestDTO dto)
    {
        _eventValidator.UpdateEventValidate(dto);

        _unitOfWork.Begin();
        try
        {
            Event? @event = await _eventRepository.GetByIdAsync(dto.Id);

            if (@event == null)
                throw new KeyNotFoundException($"Evento não encontrado.");

            @event.Id = dto.Id;
            @event.Name = dto.Name;
            @event.Description = dto.Description;
            @event.Place = dto.Place;
            @event.Capacity = dto.Capacity;
            @event.StartTime = dto.StartTime;
            @event.EndTime = dto.EndTime;
            @event.Date = dto.Date;

            await _eventRepository.UpdateEventAsync(@event, _unitOfWork.Connection, _unitOfWork.Transaction);

            if (dto.DeletedImages != null && dto.DeletedImages.Count != 0)
            {
                List<Image> imageList = await _imageRepository.GetImageListByEventId(@event.Id);

                List<Image> imageListToDelete = imageList
                    .Where(image => dto.DeletedImages.Contains(image.Id))
                    .ToList();

                foreach (var image in imageListToDelete)
                {
                    string fullFileName = $"{image.Filename}{image.Extension}";

                    ImageHandler.DeleteImageFromDisk(_settings.ImageDirectoryPath, fullFileName);

                    await _imageRepository.DeleteImageAsync(image.Id, _unitOfWork.Connection, _unitOfWork.Transaction);
                }
            }

            if (dto.ImageDetails == null || dto.ImageDetails.Count == 0)
            {
                foreach (ImageDetailsDTO imageDetails in dto.ImageDetails)
                {
                    string filename = Guid.NewGuid().ToString();

                    ImageHandler.SaveBase64AsImage(imageDetails.Base64, imageDetails.Extension, _settings.ImageDirectoryPath, filename);

                    Image newImage = Image.Create(filename, imageDetails.Extension, eventId: dto.Id);

                    await _imageRepository.SaveImage(newImage, _unitOfWork.Connection, _unitOfWork.Transaction);
                }
            }



            _unitOfWork.Commit();
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<SignUpEventResponseDTO> SignUpEventAsync(SignUpEventDTO dto)
    {
        try
        {
            Event? eventEntity = await _eventRepository.GetByIdAsync(dto.EventId);

            if (eventEntity == null)
                throw new Exception("Evento não encontrado.");

            if (DateTime.Now.Date > eventEntity.Date)
                throw new Exception("Evento encerrado.");

            int enrollmentCount = await _userEventRepository.GetEnrollmentCountByEventIdAsync(dto.EventId);

            if (enrollmentCount >= eventEntity.Capacity)
                throw new Exception("Capacidade máxima de inscrições alcançada.");

            User? userEntity = await _userRepository.GetByIdAsync(dto.UserId);

            if (userEntity == null)
                throw new Exception("Usuário não encontrado.");

            bool isEnrolled = await _userEventRepository.IsUserEnrolledInEventAsync(dto.EventId, dto.UserId);

            if (isEnrolled)
                throw new Exception("Usuário já está inscrito neste evento.");

            UserEvent userEvent = UserEvent.Create(
                dto.EventId,
                dto.UserId
            );

            string eventIdenfifier = await _userEventRepository.SaveUserEventAsync(userEvent);

            return new SignUpEventResponseDTO
            {
                EventIdentifier = eventIdenfifier
            };
        }
        catch (Exception ex)
        {
            throw new Exception($"Erro ao salvar inscrição: {ex.Message}");
        }
    }

    public async Task<GetEventListByUserIdResposeDTO> GetEventListByUserId(long userId)
    {
        try
        {
            List<Event> eventList = await _eventRepository.GetEventListByUserId(userId);

            if (eventList.IsNullOrEmpty())
                throw new Exception("Nenhum evento foi encontrado");

            return new GetEventListByUserIdResposeDTO
            {
                EventList = eventList.Select(e => new GetEventResponseDTO
                {
                    Id = e.Id,
                    Name = e.Name,
                    Description = e.Description,
                    Place = e.Place,
                    Capacity = e.Capacity,
                    Date = DateOnly.FromDateTime(e.Date),
                    StartTime = TimeOnly.FromTimeSpan(e.StartTime),
                    EndTime = TimeOnly.FromTimeSpan(e.EndTime)
                }).ToList()
            };
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<List<GetEventResponseDTO>> GetAllAsync()
    {
        List<GetEventResponseDTO> allEventsDTO = new List<GetEventResponseDTO>();

        try
        {
            List<Event> allEvents = await _eventRepository.GetAllAsync();

            foreach (Event @event in allEvents)
            {
                GetEventResponseDTO newEventDTO = new GetEventResponseDTO();

                List<Image> imageList = await _imageRepository.GetImageListByEventId(@event.Id);

                foreach (Image image in imageList)
                {
                    string filename = String.Concat(image.Filename, image.Extension);

                    string base64 = ImageHandler.ConvertImageToBase64(_settings.ImageDirectoryPath, filename);

                    ImageDetailsDTO newImageDetailsDTO = new ImageDetailsDTO
                    {
                        Base64 = base64,
                        Extension = image.Extension,
                    };

                    newEventDTO.ImageDetails.Add(newImageDetailsDTO);
                }
                newEventDTO.Id = @event.Id;
                newEventDTO.Name = @event.Name;
                newEventDTO.Description = @event.Description;
                newEventDTO.Capacity = @event.Capacity;
                newEventDTO.StartTime = TimeOnly.FromTimeSpan(@event.StartTime);
                newEventDTO.EndTime = TimeOnly.FromTimeSpan(@event.EndTime);
                newEventDTO.Date = DateOnly.FromDateTime(@event.Date);
                newEventDTO.Place = @event.Place;
                newEventDTO.Capacity = @event.Capacity;

                allEventsDTO.Add(newEventDTO);
            }

            return allEventsDTO;
        }
        catch
        {
            throw;
        }
    }
}
