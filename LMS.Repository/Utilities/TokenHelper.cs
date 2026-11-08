using Microsoft.AspNetCore.WebUtilities;
using System.Security.Cryptography;
using System.Text;

public static class TokenHelper
{
    public static string GenerateToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(32);
        return WebEncoders.Base64UrlEncode(bytes);   // URL-safe
    }

    public static string Hash(string token)
    {
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(hash);
    }
}