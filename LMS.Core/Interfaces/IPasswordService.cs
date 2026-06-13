// LMS.Core/Interfaces/IPasswordService.cs
namespace LMS.Core.Interfaces
{
    public interface IPasswordService
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string hash);
    }
}