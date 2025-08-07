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

namespace APIStartUFC.Application.Services;

public class NewsService : INewsService
{
    private readonly Settings _settings;
    private readonly INewsRepository _newsRepository;
    private readonly NewsValidator _newsValidator;
    private readonly IImageRepository _imageRepository;
    private readonly IUnitOfWork _unitOfWork;

    public NewsService(Settings settings, INewsRepository newsRepository, IImageRepository imageRepository, IUnitOfWork unitOfWork)
    {
        _settings = settings;
        _newsRepository = newsRepository;
        _newsValidator = new NewsValidator();
        _imageRepository = imageRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task SaveNewsAsync(SaveNewsRequestDTO dto)
    {
        _newsValidator.SaveNewsValidator(dto);
        _unitOfWork.Begin();

        try
        {
            News newNews = News.Create(dto.Title,
                                        dto.Content,
                                        dto.UserId
                                    );

            long newNewsId = await _newsRepository.SaveNewsAsync(newNews, _unitOfWork.Connection, _unitOfWork.Transaction);

            foreach (ImageDetailsDTO imageDetails in dto.ImageDetails)
            {
                string filename = Guid.NewGuid().ToString();

                ImageHandler.SaveBase64AsImage(imageDetails.Base64, imageDetails.Extension, _settings.ImageDirectoryPath, filename);

                Image newImage = Image.Create(filename, imageDetails.Extension, newsId: newNewsId);

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

    public async Task<GetNewsResponseDTO?> GetByIdAsync(long id)
    {
        try
        {
            News? news = await _newsRepository.GetByIdAsync(id);

            if (news == null)
                return null;

            List<Image> imageList = await _imageRepository.GetImageListByNewsId(id);
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

            return new GetNewsResponseDTO
            {
                Id = news.Id,
                Title = news.Title,
                Content = news.Content,
                ImageDetails = imageListDTO
            };
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<bool> DeleteNewsAsync(long id)
    {
        try
        {
            News? news = await _newsRepository.GetByIdAsync(id);

            if (news == null)
                return false;

            await _newsRepository.DeleteNewsAsync(id);

            return true;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task UpdateNewsAsync(UpdateNewsRequestDTO dto)
    {
        _newsValidator.UpdateNewsValidator(dto);

        _unitOfWork.Begin();
        try
        {
            News? news = await _newsRepository.GetByIdAsync(dto.Id);

            if (news == null)
                throw new KeyNotFoundException($"Notícia não encontrada.");

            news.Title = dto.Title;
            news.Content = dto.Content;

            await _newsRepository.UpdateNewsAsync(news, _unitOfWork.Connection, _unitOfWork.Transaction);

            if (dto.DeletedImages != null && dto.DeletedImages.Count != 0)
            {
                List<Image> imageList = await _imageRepository.GetImageListByNewsId(news.Id);

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

                    Image newImage = Image.Create(filename, imageDetails.Extension, newsId: dto.Id);

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
    public async Task<IEnumerable<GetNewsByTitleResponseDTO>> GetByTitleAsync(string term)
    {
        try
        {
            IEnumerable<News> newsList = await _newsRepository.GetByTitleAsync(term);

            var newsDTOList = newsList.Select(news => new GetNewsByTitleResponseDTO
            {
                Id = news.Id,
                Title = news.Title,
                Content = news.Content
            });

            return newsDTOList;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<List<GetNewsResponseDTO>> GetAllAsync()
    {
        List<GetNewsResponseDTO> allNewsDTO = new List<GetNewsResponseDTO>();

        try
        {
            List<News> allNews = await _newsRepository.GetAllAsync();

            foreach (News news in allNews)
            {
                GetNewsResponseDTO newNewsDTO = new GetNewsResponseDTO();

                List<Image> imageList = await _imageRepository.GetImageListByNewsId(news.Id);

                foreach (Image image in imageList)
                {
                    string filename = String.Concat(image.Filename, image.Extension);

                    string base64 = ImageHandler.ConvertImageToBase64(_settings.ImageDirectoryPath, filename);

                    ImageDetailsDTO newImageDetailsDTO = new ImageDetailsDTO
                    {
                        Base64 = base64,
                        Extension = image.Extension,
                    };

                    newNewsDTO.ImageDetails.Add(newImageDetailsDTO);
                }
                newNewsDTO.Id = news.Id;
                newNewsDTO.Title = news.Title;
                newNewsDTO.Content = news.Content;

                allNewsDTO.Add(newNewsDTO);
            }

            return allNewsDTO;

        }
        catch
        {
            throw;
        }
    }
}
