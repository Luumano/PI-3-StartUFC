using APIStartUFC.WebApi.Models.Request;

namespace APIStartUFC.WebApi.Validator;

public class EventRequestValidator
{
    public void Validate(SaveEventRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.StartTime))
            throw new ArgumentException("Hora de início é obrigatória.");

        if (string.IsNullOrWhiteSpace(request.EndTime))
            throw new ArgumentException("Hora de término é obrigatória.");

        if (!TimeSpan.TryParse(request.StartTime, out _))
            throw new ArgumentException("Hora de início inválida.");

        if (!TimeSpan.TryParse(request.EndTime, out _))
            throw new ArgumentException("Hora de término inválida.");
    }    
}
