namespace APIStartUFC.Shared.Utils;

public class ImageHandler
{
    public static void SaveBase64AsImage(string base64String, string extension, string directoryPath, string filename)
    {
        string format = null;

        try
        {
            if (!Directory.Exists(directoryPath))
                Directory.CreateDirectory(directoryPath);

            byte[] imageBytes = Convert.FromBase64String(base64String);

            string fullFilename = String.Concat(filename, extension);

            string filePath = Path.Combine(directoryPath, fullFilename);

            File.WriteAllBytes(filePath, imageBytes);
        }
        catch
        {
            throw new Exception("Não foi possível salvar a imagem");
        }
    }

    public static string ConvertImageToBase64(string imagePath, string filename)
    {
        try
        {

            string filePath = Path.Combine(imagePath, filename);

            byte[] imageBytes = File.ReadAllBytes(filePath);

            return Convert.ToBase64String(imageBytes);
        }
        catch
        {
            throw new Exception("Não foi possível recuperar a imagem");
        }
    }

    public static void DeleteImageFromDisk(string directoryPath, string filename)
    {
        string fullPath = Path.Combine(directoryPath, filename);

        if (File.Exists(fullPath))
        {
            try
            {
                File.Delete(fullPath);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao deletar imagem do disco: {ex.Message}");
            }
        }
        else
        {
            Console.WriteLine($"Arquivo não encontrado: {fullPath}");
        }
    }

}
