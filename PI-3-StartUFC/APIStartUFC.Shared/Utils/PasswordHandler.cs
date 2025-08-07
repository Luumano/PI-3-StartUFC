using System.Text;

namespace APIStartUFC.Shared.Utils;

public class PasswordHandler
{
    private static Random random = new Random();

    public static string GenerateRandomPassword(int comprimentoMin = 6, int comprimentoMax = 20)
    {
        if (comprimentoMin < 6 || comprimentoMax > 20 || comprimentoMin > comprimentoMax)
            throw new ArgumentException("Comprimento inválido. Deve estar entre 6 e 20.");

        int comprimento = random.Next(comprimentoMin, comprimentoMax + 1);

        const string letrasMaiusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const string letrasMinusculas = "abcdefghijklmnopqrstuvwxyz";
        const string digitos = "0123456789";
        const string todosCaracteres = letrasMaiusculas + letrasMinusculas + digitos;

        // Garantir pelo menos um de cada tipo
        char maiuscula = letrasMaiusculas[random.Next(letrasMaiusculas.Length)];
        char minuscula = letrasMinusculas[random.Next(letrasMinusculas.Length)];
        char digito = digitos[random.Next(digitos.Length)];

        StringBuilder sb = new StringBuilder();
        sb.Append(maiuscula);
        sb.Append(minuscula);
        sb.Append(digito);

        // Preencher o restante com caracteres aleatórios
        for (int i = 3; i < comprimento; i++)
        {
            sb.Append(todosCaracteres[random.Next(todosCaracteres.Length)]);
        }

        // Embaralhar para não ficar sempre na mesma ordem
        return new string(sb.ToString().OrderBy(_ => random.Next()).ToArray());
    }
}
