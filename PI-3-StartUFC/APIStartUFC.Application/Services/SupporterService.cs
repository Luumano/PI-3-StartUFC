using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.Application.DTOs.Result;
using APIStartUFC.Application.Interfaces;
using APIStartUFC.Application.Validators;
using APIStartUFC.Core.Entities;
using APIStartUFC.Infrastructure.Interfaces;
using APIStartUFC.Shared.Entities;
using APIStartUFC.Shared.Utils;

namespace APIStartUFC.Application.Services;

public class SupporterService : ISupporterService
{
    private readonly Settings _settings;
    private readonly ISupporterRepository _supporterRepository;
    private readonly SupporterValidator _supporterValidator;
    private readonly IImageRepository _imageRepository;
    private readonly IUnitOfWork _unitOfWork;

    public SupporterService(Settings settings, ISupporterRepository supporterRepository, IImageRepository imageRepository, IUnitOfWork unitOfWork)
    {
        _settings = settings;
        _supporterRepository = supporterRepository;
        _supporterValidator = new SupporterValidator();
        _imageRepository = imageRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task SaveSupporterAsync(SaveSupporterRequestDTO dto)
    {
        _supporterValidator.SaveSupporterValidate(dto);

        _unitOfWork.Begin();
        try
        {
            Supporter newSupporter = Supporter.Create(dto.Name,
                                       dto.Description,
                                       dto.UserId
                                   );

            long newSupporterId = await _supporterRepository.SaveNewSupporterAsync(newSupporter, _unitOfWork.Connection, _unitOfWork.Transaction);

            foreach (ImageDetailsDTO imageDetails in dto.ImageDetails)
            {
                string filename = Guid.NewGuid().ToString();

                ImageHandler.SaveBase64AsImage(imageDetails.Base64, imageDetails.Extension, _settings.ImageDirectoryPath, filename);

                Image newImage = Image.Create(filename, imageDetails.Extension, supporterId: newSupporterId);

                await _imageRepository.SaveImage(newImage, _unitOfWork.Connection, _unitOfWork.Transaction);
            }

            _unitOfWork.Commit();
        }
        catch (Exception)
        {
            _unitOfWork.Rollback();
            throw;
        }
    }

    public async Task<GetSupporterResponseDTO?> GetByIdAsync(long id)
    {
        try
        {
            Supporter? supporter = await _supporterRepository.GetByIdAsync(id);

            if (supporter == null)
                return null;

            List<Image> imageList = await _imageRepository.GetImageListBySupporterId(id);
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

            return new GetSupporterResponseDTO
            {
                Id = supporter.Id,
                Name = supporter.Name,
                Description = supporter.Description,
                ImageDetails = imageListDTO
            };
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<bool> DeleteSupporterAsync(long id)
    {
        try
        {
            Supporter? supporter = await _supporterRepository.GetByIdAsync(id);

            if (supporter == null)
                return false;

            await _supporterRepository.DeleteSupporterAsync(id);

            return true;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task UpdateSupporterAsync(UpdateSupporterRequestDTO dto)
    {
        _supporterValidator.UpdateSupporterValidate(dto);

        _unitOfWork.Begin();
        try
        {
            Supporter? supporter = await _supporterRepository.GetByIdAsync(dto.Id);

            if (supporter == null)
                throw new KeyNotFoundException($"Apoiador não encontrado.");

            supporter.Name = dto.Name;
            supporter.Description = dto.Description;

            await _supporterRepository.UpdateSupporterAsync(supporter, _unitOfWork.Connection, _unitOfWork.Transaction);

            if (dto.DeletedImages != null && dto.DeletedImages.Count != 0)
            {
                List<Image> imageList = await _imageRepository.GetImageListBySupporterId(supporter.Id);

                List<Image> imageListToDelete = imageList
                    .Where(image => dto.DeletedImages.Contains(image.Id))
                    .ToList();

                foreach (var image in imageList)
                {
                    string fullFileName = $"{image.Filename}{image.Extension}";

                    ImageHandler.DeleteImageFromDisk(_settings.ImageDirectoryPath, fullFileName);

                    await _imageRepository.DeleteImageAsync(image.Id, _unitOfWork.Connection, _unitOfWork.Transaction);
                }
            }

            if (dto.ImageDetails != null && dto.ImageDetails.Count != 0)
            {
                foreach (ImageDetailsDTO imageDetails in dto.ImageDetails)
                {
                    string filename = Guid.NewGuid().ToString();

                    ImageHandler.SaveBase64AsImage(imageDetails.Base64, imageDetails.Extension, _settings.ImageDirectoryPath, filename);

                    Image newImage = Image.Create(filename, imageDetails.Extension, supporterId: dto.Id);

                    await _imageRepository.SaveImage(newImage, _unitOfWork.Connection, _unitOfWork.Transaction);
                }
            }

            _unitOfWork.Commit();
        }
        catch (Exception)
        {
            _unitOfWork.Rollback();
            throw;
        }
    }

    public async Task<List<GetSupporterResponseDTO>> GetAllAsync()
    {
        List<GetSupporterResponseDTO> allSupportersDTO = new List<GetSupporterResponseDTO>();

        try
        {
            List<Supporter> allSupporters = await _supporterRepository.GetAllAsync();

            foreach (Supporter supporter in allSupporters)
            {
                GetSupporterResponseDTO newSupporterDTO = new GetSupporterResponseDTO();

                List<Image> imageList = await _imageRepository.GetImageListBySupporterId(supporter.Id);

                foreach (Image image in imageList)
                {
                    string filename = String.Concat(image.Filename, image.Extension);

                    string base64 = ImageHandler.ConvertImageToBase64(_settings.ImageDirectoryPath, filename);

                    ImageDetailsDTO newImageDetailsDTO = new ImageDetailsDTO
                    {
                        Base64 = base64,
                        Extension = image.Extension,
                    };

                    newSupporterDTO.ImageDetails.Add(newImageDetailsDTO);
                }
                newSupporterDTO.Id = supporter.Id;
                newSupporterDTO.Name = supporter.Name;
                newSupporterDTO.Description = supporter.Description;

                allSupportersDTO.Add(newSupporterDTO);
            }

            return allSupportersDTO;
        }
        catch
        {
            throw;
        }

    }
}
