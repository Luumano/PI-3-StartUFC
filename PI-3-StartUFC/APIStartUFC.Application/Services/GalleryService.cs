using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.Application.DTOs.Result;
using APIStartUFC.Application.Interfaces;
using APIStartUFC.Application.Validators;
using APIStartUFC.Core.Entities;
using APIStartUFC.Infrastructure.Interfaces;
using APIStartUFC.Shared.Entities;
using APIStartUFC.Shared.Utils;

namespace APIStartUFC.Application.Services;

public class GalleryService : IGalleryService
{
    private readonly Settings _settings;
    private readonly IGalleryRepository _galleryRepository;
    private readonly GalleryValidator _galleryValidator;
    private readonly IImageRepository _imageRepository;
    private readonly IUnitOfWork _unitOfWork;
    public GalleryService(Settings settings, IGalleryRepository galleryRepository, IImageRepository imageRepository, IUnitOfWork unitOfWork)
    {
        _settings = settings;
        _galleryRepository = galleryRepository;
        _galleryValidator = new GalleryValidator();
        _imageRepository = imageRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task SaveGalleryAsync(SaveGalleryRequestDTO dto)
    {
        _galleryValidator.SaveGalleryValidator(dto);

        _unitOfWork.Begin();
        try
        {
            Gallery newGallery = Gallery.Create(dto.Title, dto.UserId);

            long newGalleryId = await _galleryRepository.SaveNewGalleryAsync(newGallery, _unitOfWork.Connection, _unitOfWork.Transaction);

            foreach (ImageDetailsDTO imageDetails in dto.ImageDetails)
            {
                string filename = Guid.NewGuid().ToString();

                ImageHandler.SaveBase64AsImage(imageDetails.Base64, imageDetails.Extension, _settings.ImageDirectoryPath, filename);

                Image newImage = Image.Create(filename, imageDetails.Extension, galleryId: newGalleryId);

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

    public async Task<GetGalleryResponseDTO?> GetByIdAsync(long id)
    {
        try
        {
            Gallery? gallery = await _galleryRepository.GetByIdAsync(id);

            if (gallery == null)
                return null;

            List<Image> imageList = await _imageRepository.GetImageListByGalleryId(id);
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

            return new GetGalleryResponseDTO
            {
                Id = gallery.Id,
                Title = gallery.Title,
                ImageDetails = imageListDTO
            };
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<bool> DeleteGalleryAsync(long id)
    {
        try
        {
            Gallery? gallery = await _galleryRepository.GetByIdAsync(id);

            if (gallery == null)
                return false;

            await _galleryRepository.DeleteGalleryAsync(id);

            return true;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task UpdateGalleryAsync(UpdateGalleryRequestDTO dto)
    {
        _galleryValidator.UpdateGalleryValidator(dto);

        _unitOfWork.Begin();
        try
        {
            Gallery? gallery = await _galleryRepository.GetByIdAsync(dto.Id);

            if (gallery == null)
                throw new KeyNotFoundException($"Galeria não encontrado.");

            gallery.Title = dto.Title;

            await _galleryRepository.UpdateGalleryAsync(gallery, _unitOfWork.Connection, _unitOfWork.Transaction);

            if (dto.DeletedImages != null && dto.DeletedImages.Count != 0)
            {
                List<Image> imageList = await _imageRepository.GetImageListByGalleryId(gallery.Id);

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

            if (dto.ImageDetails != null && dto.ImageDetails.Count != 0)
            {
                foreach (ImageDetailsDTO imageDetails in dto.ImageDetails)
                {
                    string filename = Guid.NewGuid().ToString();

                    ImageHandler.SaveBase64AsImage(imageDetails.Base64, imageDetails.Extension, _settings.ImageDirectoryPath, filename);

                    Image newImage = Image.Create(filename, imageDetails.Extension, galleryId: dto.Id);

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

    public async Task<List<GetGalleryResponseDTO>> GetAllAsync()
    {
        List<GetGalleryResponseDTO> allGallerysDTO = new List<GetGalleryResponseDTO>();

        try
        {
            List<Gallery> allGallerys = await _galleryRepository.GetAllAsync();

            foreach (Gallery gallery in allGallerys)
            {
                GetGalleryResponseDTO newGalleryDTO = new GetGalleryResponseDTO();

                List<Image> imageList = await _imageRepository.GetImageListByGalleryId(gallery.Id);

                foreach (Image image in imageList)
                {
                    string filename = String.Concat(image.Filename, image.Extension);

                    string base64 = ImageHandler.ConvertImageToBase64(_settings.ImageDirectoryPath, filename);

                    ImageDetailsDTO newImageDetailsDTO = new ImageDetailsDTO
                    {
                        Base64 = base64,
                        Extension = image.Extension,
                    };

                    newGalleryDTO.ImageDetails.Add(newImageDetailsDTO);
                }
                newGalleryDTO.Id = gallery.Id;
                newGalleryDTO.Title = gallery.Title;

                allGallerysDTO.Add(newGalleryDTO);
            }

            return allGallerysDTO;
        }
        catch
        {
            throw;
        }

    }
}
