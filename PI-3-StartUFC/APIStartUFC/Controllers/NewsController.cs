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
public class NewsController : ControllerBase
{
    private readonly INewsService _newsService;
    public NewsController(INewsService newsService)
    {
        _newsService = newsService;
    }

    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        try
        {
            
            var result = await _newsService.GetAllAsync();

            var response = ResponseMapper.Map(true, result, "Nóticias recuperadas com sucesso");
           
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor: " + ex.Message));
        }
    }

    [HttpPost("[action]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult<SaveNewsResponse>> SaveNews([FromBody] SaveNewsRequest saveNewsRequest)
    {
        try
        {

            SaveNewsRequestDTO saveNewsRequestDTO = NewsMapper.MapSaveNewsRequestToDTO(saveNewsRequest);

            await _newsService.SaveNewsAsync(saveNewsRequestDTO);

            return Ok(saveNewsRequestDTO);
        }
        catch (Exception)
        {
            throw;
        }
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult> GetById(int id)
    {
        try
        {
            var result = await _newsService.GetByIdAsync(id);

            if (result == null)
            {
                return NotFound(ResponseMapper.Map(false, null, "Notícia não encontrada"));
            }

            var response = ResponseMapper.Map(true, result, "Notícia recuperada com sucesso");

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor"));
        }
    }

    [HttpDelete("{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> DeleteNewsAsync(int id)
    {
        try
        {
            bool deleted = await _newsService.DeleteNewsAsync(id);

            if (!deleted)
            {
                return NotFound(ResponseMapper.Map(false, null, "Notícia não encontrada"));
            }

            return Ok(ResponseMapper.Map(true, null, "Notícia deletada com sucesso"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor"));
        }
    }

    [HttpPut()]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> UpdateNewsAsync([FromBody] UpdateNewsRequest newsRequest)
    {
        if (newsRequest == null)
            return BadRequest(ResponseMapper.Map(false, null, "Corpo da requisição vazio"));

        try
        {
            UpdateNewsRequestDTO dto = NewsMapper.MapUpdateNewsRequestToDTO(newsRequest);

            await _newsService.UpdateNewsAsync(dto);

            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ResponseMapper.Map(false, null, ex.Message));
        }
        catch (Exception)
        {
            return StatusCode(
                500,
                ResponseMapper.Map(false, null, "Erro interno do servidor"));
        }
    }

    [HttpGet("search")]
    public async Task<ActionResult> GetByTitle([FromQuery] string term)
    {
        try
        {
            var result = await _newsService.GetByTitleAsync(term);

            if (result == null || !result.Any())
            {
                return NotFound(ResponseMapper.Map(false, null, "Nenhuma notícia encontrada com o título fornecido"));
            }

            var response = ResponseMapper.Map(true, result, "Notícia recuperada com sucesso");

            return Ok(response);
        }
        catch (Exception)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor"));
        }
    }

}
