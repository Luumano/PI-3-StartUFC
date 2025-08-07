using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.Application.DTOs.Result;

namespace APIStartUFC.Application.Interfaces;

public interface IAuthenticateService
{
    public Task<AuthenticateResponseDTO> Authenticate(AuthenticateRequestDTO dto);
}
