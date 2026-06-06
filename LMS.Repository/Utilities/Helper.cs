using LMS.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Repository.Utilities
{
    public class Helper : IHelper
    {
        public string Encrypt(string plainText, string key)
        {
            using var aes = Aes.Create();
            aes.Key = SHA256.HashData(Encoding.UTF8.GetBytes(key));
            aes.GenerateIV();

            using var encryptor = aes.CreateEncryptor();
            var plainBytes = Encoding.UTF8.GetBytes(plainText);
            var cipherBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

            var result = Convert.ToBase64String(aes.IV) + ":" + Convert.ToBase64String(cipherBytes);
            return result;
        }

        public string Decrypt(string encrypted, string key)
        {
            var parts = encrypted.Split(':');
            var iv = Convert.FromBase64String(parts[0]);
            var cipherBytes = Convert.FromBase64String(parts[1]);

            using var aes = Aes.Create();
            aes.Key = SHA256.HashData(Encoding.UTF8.GetBytes(key));
            aes.IV = iv;

            using var decryptor = aes.CreateDecryptor();
            var plainBytes = decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);
            return Encoding.UTF8.GetString(plainBytes);
        }
    }
}
