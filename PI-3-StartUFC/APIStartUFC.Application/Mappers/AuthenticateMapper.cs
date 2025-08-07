using APIStartUFC.Application.DTOs.Result;

namespace APIStartUFC.Application.Mappers;

public class AuthenticateMapper
{
    public AuthenticateResponseDTO Map(string jwtToken)
    {
        return new AuthenticateResponseDTO
        {
            JwtToken = jwtToken
        };
    }
}