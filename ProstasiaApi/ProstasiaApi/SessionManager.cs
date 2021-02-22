using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;

namespace ProstasiaApi
{
    public class SessionManager
    {
        private static Dictionary<string, User> tokenList { get; set; }

        public static void Start()
        {
            tokenList = new Dictionary<string, User>();
        }

        public static Dictionary<string, User> GetTokenList()
        {
            return tokenList;
        }

        public static User Authenticate(string token)
        {
            if (GetTokenList().ContainsKey(token))
            {
                return GetTokenList()[token];
            }

            return null;
        }

        public static string CreateToken(User user)
        {
            foreach (User result in tokenList.Values)
            {
                if (result.username == user.username)
                {
                    return tokenList.First(x => x.Value.username == user.username).Key;
                }
            }
            
            foreach (User kank in tokenList.Values)
            {
                Console.WriteLine(kank.username);
            }
            Console.WriteLine($"user with username {user.username} does not hab token.");
            string token;
            while (true)
            {
                using var csprng = new RNGCryptoServiceProvider();
                var bytes = new byte[16];
                csprng.GetNonZeroBytes(bytes);
                token = string.Join("", bytes.Select(b => b.ToString("x2")));

                if (!tokenList.ContainsKey(token))
                {
                    break;
                }
            }
            tokenList.Add(token, user);
            Console.WriteLine("added user: " + user.username);
            return token;
            
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