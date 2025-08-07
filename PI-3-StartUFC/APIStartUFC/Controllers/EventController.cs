using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.Application.DTOs.Response;
using APIStartUFC.Application.DTOs.Result;
using APIStartUFC.Application.Interfaces;
using APIStartUFC.WebApi.Mappers;
using APIStartUFC.WebApi.Models.Request;
using APIStartUFC.WebApi.Models.Response;
using APIStartUFC.WebApi.Validator;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIStartUFC.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class EventController : ControllerBase
{
    private readonly IEventService _eventService;
    private readonly EventRequestValidator _eventRequestValidator;

    public EventController(IEventService eventService)
    {
        _eventService = eventService;
        _eventRequestValidator = new EventRequestValidator();
    }

    [HttpPost("[action]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult<SaveEventResponse>> SaveEvent([FromBody] SaveEventRequest saveEventRequest)
    {
        try
        {
            _eventRequestValidator.Validate(saveEventRequest);

            SaveEventRequestDTO saveEventRequestDTO = EventMapper.MapSaveEventRequestToDTO(saveEventRequest);

            await _eventService.SaveEventAsync(saveEventRequestDTO);

            return Ok(saveEventRequestDTO);
        }
        catch (Exception ex)
        {
            return StatusCode(400, ResponseMapper.Map(false, null, ex.Message));
        }
    }

    [HttpGet("{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult> GetById(int id)
    {
        try
        {
            var result = await _eventService.GetByIdAsync(id);

            if (result == null)
            {
                return NotFound(ResponseMapper.Map(false, null, "Evento não encontrado"));
            }

            var response = ResponseMapper.Map(true, result, "Evento recuperado com sucesso");

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor"));
        }
    }

    [HttpDelete("{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> DeleteEventAsync(int id)
    {
        try
        {
            bool deleted = await _eventService.DeleteEventAsync(id);
            if (!deleted)
            {
                return NotFound(ResponseMapper.Map(false, null, "Evento não encontrado"));
            }
            return Ok(ResponseMapper.Map(true, null, "Evento deletado com sucesso"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor"));
        }
    }

    [HttpPut()]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> UpdateEventAsync([FromBody] UpdateEventRequest eventRequest)
    {
        if (eventRequest == null)
            return BadRequest(ResponseMapper.Map(false, null, "Corpo da requisição vazio"));
        try
        {
            UpdateEventRequestDTO dto = EventMapper.MapUpdateEventRequestToDTO(eventRequest);
            await _eventService.UpdateEventAsync(dto);
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

    [HttpPost("signup")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult> SignUp([FromBody] SignUpEventDTO registration)
    {
        try
        {
            SignUpEventResponseDTO response = await _eventService.SignUpEventAsync(registration);

            return Ok(ResponseMapper.Map(true, response, "Inscrição realizada com sucesso."));
        }
        catch (Exception ex)
        {
            return BadRequest(ResponseMapper.Map(false, null, ex.Message));
        }
    }

    [HttpGet("user-events/{userId}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult<GetEventListByUserIdResposeDTO>> GetEventListByUserId(long userId)
    {
        try
        {
            GetEventListByUserIdResposeDTO response = await _eventService.GetEventListByUserId(userId);
            return Ok(ResponseMapper.Map(true, response));
        }
        catch (Exception ex)
        {
            return BadRequest(ResponseMapper.Map(false, null, ex.Message));
        }
    }

    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        try
        {
            var result = await _eventService.GetAllAsync();
            var response = ResponseMapper.Map(true, result, "Eventos recuperados com sucesso");
            return Ok(response);
        }
        catch (Exception)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor: "));
        }
    }
}
