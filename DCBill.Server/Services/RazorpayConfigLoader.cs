using LMS.Core.Entities;
using LMS.Core.Interfaces;
using LMS.Repository.Utilities;
using System;

public static class RazorpayConfigLoader
{
    public static RazorpayOptions Load(AppSettings appSettings)
    {
        
        // Read master key from environment
        var masterKey = Environment.GetEnvironmentVariable("App_MasterKey");
        if (string.IsNullOrEmpty(masterKey))
            throw new Exception("❌ App_MasterKey not found in environment variables!");

        // Read encrypted Razorpay value from config
        var encrypted = appSettings.NexBill;
        if (string.IsNullOrEmpty(encrypted))
            throw new Exception("❌ Razorpay:EncryptedKeys not found in appsettings.json!");

        // Decrypt
        IHelper helper = new Helper();
        var decrypted = helper.Decrypt(encrypted, masterKey);

        // Split into KeyId:KeySecret
        var parts = decrypted.Split(':');
        if (parts.Length != 2)
            throw new Exception("❌ Invalid Razorpay secret format. Expected KeyId:KeySecret.");

        return new RazorpayOptions
        {
            KeyId = parts[0],
            KeySecret = parts[1]
        };
    }
}
