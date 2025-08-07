using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.Application.Interfaces;
using APIStartUFC.WebApi.Mappers;
using APIStartUFC.WebApi.Models.Request;
using APIStartUFC.WebApi.Models.Response;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIStartUFC.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class GalleryController : ControllerBase
{
    private readonly IGalleryService _galleryService;
    public GalleryController(IGalleryService galleryService)
    {
        _galleryService = galleryService;
    }

    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        try
        {
            var result = await _galleryService.GetAllAsync();
            var response = ResponseMapper.Map(true, result, "Galerias recuperadas com sucesso");
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor: " + ex.Message));
        }
    }

    [HttpPost("[action]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult<SaveGalleryResponse>> SaveGallery([FromBody] SaveGalleryRequest saveGalleryRequest)
    {
        try
        {
            SaveGalleryRequestDTO saveGalleryRequestDTO = GalleryMapper.MapSaveGalleryRequestToDTO(saveGalleryRequest);
            await _galleryService.SaveGalleryAsync(saveGalleryRequestDTO);
            return Ok(saveGalleryRequestDTO);
        }
        catch (Exception)
        {
            throw;
        }
    }

    [HttpGet("{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult> GetById(int id)
    {
        try
        {
            var result = await _galleryService.GetByIdAsync(id);
            if (result == null)
            {
                return NotFound(ResponseMapper.Map(false, null, "Galeria não encontrada"));
            }
            var response = ResponseMapper.Map(true, result, "Galeria recuperada com sucesso");
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor"));
        }
    }

    [HttpDelete("{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> DeleteGalleryAsync(int id)
    {
        try
        {
            bool deleted = await _galleryService.DeleteGalleryAsync(id);
            if (!deleted)
            {
                return NotFound(ResponseMapper.Map(false, null, "Galeria não encontrada"));
            }
            return Ok(ResponseMapper.Map(true, null, "Galeria deletada com sucesso"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor"));
        }
    }

    [HttpPut()]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> UpdateGalleryAsync([FromBody] UpdateGalleryRequest galleryRequest)
    {
        if (galleryRequest == null)
            return BadRequest(ResponseMapper.Map(false, null, "Corpo da requisição vazio"));

        try
        {
            UpdateGalleryRequestDTO dto = GalleryMapper.MapUpdateGalleryRequestToDTO(galleryRequest);
            await _galleryService.UpdateGalleryAsync(dto);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ResponseMapper.Map(false, null, ex.Message));
        }
        catch (Exception)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor"));
        }
    }
}