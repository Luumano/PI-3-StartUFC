using APIStartUFC.Shared.Entities;
using System.Net;
using System.Net.Mail;

namespace APIStartUFC.Infrastructure.Services;

public class MailService
{
    private readonly Settings _settings;

    public MailService(Settings settings)
    {
        _settings = settings;
    }

    public void SendMail(string recipient, string subject, string body)
    {
        try
        {
            string sender = _settings.MailServiceDefault;

            MailMessage mail = new MailMessage(sender, recipient, subject, body);
            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);

            smtpClient.Credentials = new NetworkCredential(sender, _settings.MailServicePassword);
            smtpClient.EnableSsl = true;

            smtpClient.Send(mail);
        }
        catch (Exception)
        {
            throw new Exception($"Erro ao enviar email");
        }
    }
}
