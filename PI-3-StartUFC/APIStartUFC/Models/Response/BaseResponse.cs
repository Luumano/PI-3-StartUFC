namespace APIStartUFC.WebApi.Models.Response;

public class BaseResponse
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public object Data { get; set; }
}

