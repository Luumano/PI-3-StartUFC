using APIStartUFC.WebApi.Models.Response;

namespace APIStartUFC.WebApi.Mappers;

public class ResponseMapper
{
    public static BaseResponse Map(bool success, object data, string message = null)
    {
        return new BaseResponse
        {
            Success = success,
            Data = data,
            Message = message
        };
    }
}

