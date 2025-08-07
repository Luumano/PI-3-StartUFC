using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.Application.Interfaces;
using APIStartUFC.WebApi.Mappers;
using APIStartUFC.WebApi.Models.Request;
using APIStartUFC.WebApi.Validator;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIStartUFC.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ChangePasswordRequestValidator _changePasswordRequestValidator;
    public UserController(IUserService userService)
    {
        _userService = userService;
        _changePasswordRequestValidator = new ChangePasswordRequestValidator();
    }

    [HttpPost("[action]")]
    public async Task<ActionResult<SaveUserReponse>> SaveUser([FromBody] SaveUserRequest saveUserRequest)
    {
        try
        {
            SaveUserRequestDTO saveUserRequestDTO = UserMapper.MapSaveUserRequestToDTO(saveUserRequest);

            await _userService.SaveUserAsync(saveUserRequestDTO);

            return Ok(saveUserRequestDTO);
        }
        catch (Exception)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor"));
        }
    }

    [HttpGet("{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult> GetById(int id)
    {
        try
        {
            var result = await _userService.GetByIdAsync(id);

            if (result == null)
            {
                return NotFound(ResponseMapper.Map(false, null, "Usuário não encontrado"));
            }

            var response = ResponseMapper.Map(true, result, "Usuário recuperado com sucesso");

            return Ok(response);
        }
        catch (Exception)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor"));
        }
    }

    [HttpDelete("{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> DeleteUserAsync(int id)
    {
        try
        {
            bool deleted = await _userService.DeleteUserAsync(id);

            if (!deleted)
            {
                return NotFound(ResponseMapper.Map(false, null, "Usuário não encontrado"));
            }

            return Ok(ResponseMapper.Map(true, null, "Usuário deletado com sucesso"));
        }
        catch (Exception)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, "Erro interno do servidor"));
        }
    }

    [HttpPut()]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> UpdateUserAsync([FromBody] UpdateUserRequest userRequest)
    {
        if (userRequest == null)
            return BadRequest(ResponseMapper.Map(false, null, "Corpo da requisição vazio"));

        try
        {
            UpdateUserRequestDTO dto = UserMapper.MapUpdateUserRequestToDTO(userRequest);

            await _userService.UpdateUserAsync(dto);

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

    [HttpPost("[action]")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest resetPasswordRequest)
    {
        if (resetPasswordRequest == null)
            return BadRequest(ResponseMapper.Map(false, null, "Corpo da requisição vazio"));

        try
        {
            ResetPasswordRequestDTO dto = UserMapper.MapResetPasswordRequestToDTO(resetPasswordRequest);

            await _userService.ResetPassword(dto);

            var response = ResponseMapper.Map(true, null, "Senha atualizada com sucesso. Verifique seu email para encontrar a senha.");

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, ex.Message));
        }
    }

    [HttpPost("[action]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest changePasswordRequest)
    {
        if (changePasswordRequest == null)
            return BadRequest(ResponseMapper.Map(false, null, "Corpo da requisição vazio"));

        try
        {
            _changePasswordRequestValidator.Validate(changePasswordRequest);

            int userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value);

            ChangePasswordRequestDTO dto = UserMapper.MapChangePasswordRequestToDTO(changePasswordRequest, userId);

            await _userService.ChangePasswordAsync(dto);

            var response = ResponseMapper.Map(true, null, "Senha alterada com sucesso");

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ResponseMapper.Map(false, null, ex.Message));
        }
    }
}
