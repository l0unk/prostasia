using System;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using System.IO;

namespace ProstasiaApi
{
    public class Database
    {

        private static MongoClient dbClient;

        public static void connect()
        {
            dbClient = new MongoClient(LoadConnStr());
        }

        private static string LoadConnStr()
        {
            string[] connStrArr = File.ReadAllLines("conn.txt");
            return connStrArr[0];
        }
        
        public static async Task<string> GetUserPassword(User user)
        {
            var db = dbClient.GetDatabase("Prostasia");
            var collection = db.GetCollection<BsonDocument>("Users");
            var filter = Builders<BsonDocument>.Filter.Eq("username", user.username);
            var result = collection.Find(filter).FirstOrDefault();
            if (result != null)
            {
                return result.GetValue("password").ToString();
            } else
            {
                return null;
            }
        }
    }
}