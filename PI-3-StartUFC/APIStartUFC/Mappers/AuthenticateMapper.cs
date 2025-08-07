using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.WebApi.Models.Request;

namespace APIStartUFC.WebApi.Mappers;

public class AuthenticateMapper
{
    public static AuthenticateRequestDTO MapAuthenticateRequestToDTO(AuthenticateRequest authRequest)
    {
        return new AuthenticateRequestDTO
        {
            Login = authRequest.Login,
            Password = authRequest.Password
        };
    }
}
