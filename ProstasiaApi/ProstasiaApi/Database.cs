using System;
using System.Collections.Generic;
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

        public static IMongoDatabase Getdb()
        {
            return dbClient.GetDatabase("Prostasia");
        }

        public static async Task CreateIdentity(Identity identity)
        {
            var db = dbClient.GetDatabase("Prostasia");
            var collection = db.GetCollection<Identity>("Identities");
            await collection.InsertOneAsync(identity);
        }
        
        public static async Task<List<Identity>> GetIdentitiesByUsername(string username)
        {
            var db = dbClient.GetDatabase("Prostasia");
            var collection = db.GetCollection<Identity>("Identities");
            var filter = Builders<Identity>.Filter.Eq("ownerUsername", username);
            return await collection.Find(filter).ToListAsync();
        }

        public static async Task UpdateIdentity(Identity identity)
        {
            var db = dbClient.GetDatabase("Prostasia");
            var collection = db.GetCollection<Identity>("Identities");
            var filter = Builders<Identity>.Filter.Eq("_id", identity._id);
            await collection.FindOneAndReplaceAsync(filter, identity);
        }
    }
}