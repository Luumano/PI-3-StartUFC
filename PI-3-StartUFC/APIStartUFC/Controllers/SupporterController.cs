using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.Application.DTOs.Result;
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
public class SupporterController : ControllerBase
{
    private readonly ISupporterService _supporterService;
    public SupporterController(ISupporterService supporterService)
    {
        _supporterService = supporterService;
    }

    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        try
        {
            List<GetSupporterResponseDTO> result = await _supporterService.GetAllAsync();

            var response = ResponseMapper.Map(true, result, "Apoiadores recuperados com sucesso");

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor " + ex.Message));
        }
    }

    [HttpPost("[action]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult<SaveSupporterResponse>> SaveSupporter([FromBody] SaveSupporterRequest saveSupporterRequest)
    {
        try
        {

            SaveSupporterRequestDTO saveSupporterRequestDTO = SupporterMapper.MapSaveSupporterRequestToDTO(saveSupporterRequest);

            await _supporterService.SaveSupporterAsync(saveSupporterRequestDTO);

            return Ok(saveSupporterRequestDTO);
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
            var result = await _supporterService.GetByIdAsync(id);

            if (result == null)
            {
                return NotFound(ResponseMapper.Map(false, null, "Apoiador não encontrado"));
            }

            var response = ResponseMapper.Map(true, result, "Apoiador recuperado com sucesso");

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor"));
        }
    }

    [HttpDelete("{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> DeleteSupporterAsync(int id)
    {
        try
        {
            bool deleted = await _supporterService.DeleteSupporterAsync(id);

            if (!deleted)
            {
                return NotFound(ResponseMapper.Map(false, null, "Apoiador não encontrado"));
            }

            return Ok(ResponseMapper.Map(true, null, "Apoiador deletado com sucesso"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor"));
        }
    }

    [HttpPut()]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> UpdateSupporterAsync([FromBody] UpdateSupporterRequest supporterRequest)
    {
        if (supporterRequest == null)
            return BadRequest(ResponseMapper.Map(false, null, "Corpo da requisição vazio"));

        try
        {
            UpdateSupporterRequestDTO dto = SupporterMapper.MapUpdateSupporterRequestToDTO(supporterRequest);

            await _supporterService.UpdateSupporterAsync(dto);

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

}