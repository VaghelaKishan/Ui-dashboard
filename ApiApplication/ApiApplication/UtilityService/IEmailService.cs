using ApiApplication.Models;

namespace ApiApplication.UtilityService
{
    public interface IEmailService
    {
        void SendEmail(EmailModel emailModel);
    }
}
  