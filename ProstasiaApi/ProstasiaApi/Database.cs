using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using System.IO;

namespace ProstasiaApi
{
    public class Database
    {
        public string LoadConnStr()
        {
            string[] connStrArr = File.ReadAllLines("conn.txt");
            return connStrArr[0];
        }
        
        public async Task<string> GetUserPassword(string username)
        {
            MongoClient dbClient = new MongoClient(LoadConnStr());
            var db = dbClient.GetDatabase("Prostasia");
            var collection = db.GetCollection<BsonDocument>("Users");
            var filter = Builders<BsonDocument>.Filter.Eq("username", username);
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