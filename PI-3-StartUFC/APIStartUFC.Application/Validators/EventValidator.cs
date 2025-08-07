using APIStartUFC.Application.DTOs.Request;

namespace APIStartUFC.Application.Validators;

public class EventValidator
{
    public void SaveEventValidate(SaveEventRequestDTO dto)
    {
        if (dto.StartTime < TimeSpan.Zero || dto.StartTime >= TimeSpan.FromHours(24))
            throw new Exception("A hora de início deve estar entre 00:00 e 23:59.");

        if (dto.EndTime < TimeSpan.Zero || dto.EndTime >= TimeSpan.FromHours(24))
            throw new Exception("A hora de término deve estar entre 00:00 e 23:59.");

        if (dto.StartTime > dto.EndTime)
            throw new Exception("A hora de início não pode ser maior que a hora de término.");

        var now = DateTime.Now;

        var eventStart = dto.Date.Date + dto.StartTime;
        var eventEnd = dto.Date.Date + dto.EndTime;

        if (eventStart < now)
            throw new Exception("A data/hora de início do evento não pode ser menor que a data atual.");

        if (eventEnd < now)
            throw new Exception("A data/hora de término do evento não pode ser menor que a data atual.");

        if (dto.Capacity <= 0)
            throw new Exception("As vagas do evento não podem ser menor ou igual a que zero.");

        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new Exception("O nome do evento é obrigatório.");

        if (string.IsNullOrWhiteSpace(dto.Description))
            throw new Exception("A descrição do evento é obrigatória.");

        if (dto.Name.Length < 3 || dto.Name.Length > 150)
            throw new Exception("O nome do evento deve ter entre 3 e 150 caracteres.");

        if (dto.Description.Length > 1500)
            throw new Exception("A descrição do evento deve ter até 1500 caracteres.");
    }

    public void UpdateEventValidate(UpdateEventRequestDTO dto)
    {
        if (dto.StartTime > dto.EndTime)
            throw new Exception("A hora de início não pode ser maior que a hora de término.");

        var now = DateTime.Now;

        var eventStart = dto.Date.Date + dto.StartTime;
        var eventEnd = dto.Date.Date + dto.EndTime;

        if (eventStart < now)
            throw new Exception("A data/hora de início do evento não pode ser menor que a data atual.");

        if (eventEnd < now)
            throw new Exception("A data/hora de término do evento não pode ser menor que a data atual.");

        if (dto.Capacity <= 0)
            throw new Exception("As vagas do evento não podem ser menor ou igual a que zero.");

        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new Exception("O nome do evento é obrigatório.");

        if (string.IsNullOrWhiteSpace(dto.Description))
            throw new Exception("A descrição do evento é obrigatória.");

        if (dto.Name.Length < 3 || dto.Name.Length > 150)
            throw new Exception("O nome do evento deve ter entre 3 e 150 caracteres.");

        if (dto.Description.Length > 1500)
            throw new Exception("A descrição do evento deve ter até 1500 caracteres.");
    }    
}
