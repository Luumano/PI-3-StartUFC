using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.Application.DTOs.Result;
using APIStartUFC.Application.Interfaces;
using APIStartUFC.WebApi.Mappers;
using APIStartUFC.WebApi.Models.Request;
using APIStartUFC.WebApi.Models.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIStartUFC.WebApi.Controllers;


[ApiController]
[Route("[controller]")]
public class AuthenticateController : ControllerBase
{
    private readonly IAuthenticateService _authService;
    public AuthenticateController(IAuthenticateService authService)
    {
        _authService = authService;
    }

    [AllowAnonymous]
    [HttpPost("[action]")]
    public async Task<IActionResult> Authenticate([FromBody] AuthenticateRequest authenticateRequest)
    {
        try
        {
            AuthenticateRequestDTO authRequestDTO = AuthenticateMapper.MapAuthenticateRequestToDTO(authenticateRequest);

            AuthenticateResponseDTO result = await _authService.Authenticate(authRequestDTO);

            BaseResponse response = ResponseMapper.Map(true, result);

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(400, ResponseMapper.Map(false, null, ex.Message));
        }
    }

}
