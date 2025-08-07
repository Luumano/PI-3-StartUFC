using APIStartUFC.Application.DTOs.Request;
using APIStartUFC.Application.DTOs.Result;
using APIStartUFC.Application.Interfaces;
using APIStartUFC.Application.Mappers;
using APIStartUFC.Application.Validators;
using APIStartUFC.Core.Entities;
using APIStartUFC.Infrastructure.Interfaces;
using APIStartUFC.Shared.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace APIStartUFC.Application.Services;

public class AuthenticateService : IAuthenticateService
{
    private readonly IUserRepository _userRepository;
    private readonly UserValidator _userValidator;
    private readonly Settings _settings;
    private readonly AuthenticateMapper _authMapper;

    public AuthenticateService(IUserRepository userRepository, Settings settings)
    {
        _userRepository = userRepository;
        _settings = settings;
        _userValidator = new UserValidator();
        _authMapper = new AuthenticateMapper();
    }

    //public async Task<AuthenticateResponseDTO> Authenticate(AuthenticateRequestDTO dto)
    //{
    //    if (!_userValidator.IsValidEmail(dto.Login))
    //        throw new Exception("Email inválido");

    //    User? user = await _userRepository.GetByEmailAsync(dto.Login);

    //    if (user == null)
    //        throw new Exception("Usuário não encontrado");
    //    else
    //    {
    //        if (user.Password != dto.Password)
    //            throw new Exception("Senha incorreta");

    //        string jwtToken = GenerateJwtToken(dto, user.Id.ToString());

    //        AuthenticateResponseDTO authResponseDTO = _authMapper.Map(jwtToken);

    //        return authResponseDTO;
    //    }
    //}

    public async Task<AuthenticateResponseDTO> Authenticate(AuthenticateRequestDTO dto)
    {
        if (!_userValidator.IsValidEmail(dto.Login))
            throw new Exception("Email inválido");

        User? user = await _userRepository.GetByEmailAsync(dto.Login);

        if (user == null)
            throw new Exception("Usuário não encontrado");

        bool correctPassword = PasswordHasher.VerifyPassword(dto.Password, user.PasswordSalt, user.PasswordHash);

        if (!correctPassword)
            throw new Exception("Senha incorreta");

        string jwtToken = GenerateJwtToken(dto, user.Id.ToString());

        AuthenticateResponseDTO authResponseDTO = _authMapper.Map(jwtToken);

        return authResponseDTO;
    }


    private string GenerateJwtToken(AuthenticateRequestDTO dto, string userId)
    {
        JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();

        byte[] key = Encoding.ASCII.GetBytes(_settings.JwtSecret);
        SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, dto.Login),
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Role, "default")
            }),
            Expires = DateTime.UtcNow.AddMinutes(_settings.JwtExpirationTime),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
