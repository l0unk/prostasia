using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;

namespace ProstasiaApi
{
    public class SessionManager
    {
        private static Dictionary<string, object> tokenList { get; set; }

        public static string CreateToken(User user)
        {
            if (!tokenList.ContainsValue(user))
            {
                using var csprng = new RNGCryptoServiceProvider();
                var bytes = new byte[16];
                csprng.GetNonZeroBytes(bytes);
                string token = string.Join("", bytes.Select(b => b.ToString("x2")));
                
                tokenList.Add(token, user);
            }
            else
            {
                return tokenList.FirstOrDefault(x => x.Value == user).Key;
            }

            return null;
        }
        
        public static void DeleteToken(string token)
        {
            if (tokenList.ContainsKey(token))
            {
                tokenList.Remove(token);
            }
        }
    }
}