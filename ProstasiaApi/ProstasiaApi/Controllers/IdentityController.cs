using System;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;

namespace ProstasiaApi.Controllers
{
    [Route("/api/identity")]
    [ApiController]
    [Produces("application/json")]
    public class IdentityController : ControllerBase
    {
        [Route("/api/identity/create")]
        [HttpPost]
        public async Task<ActionResult> createIdentity(JsonElement variable)
        {
            JObject thingie = JObject.Parse(variable.ToString());
            JToken jtoken = thingie.GetValue("name");
            string name = jtoken.ToString();
            string token = Request.Cookies["session"];
            if (token == null)
            {
                return StatusCode(400);
            }
            User user = SessionManager.Authenticate(token);
            if (user == null)
            {
                return StatusCode(403);
            }

            IMongoCollection<BsonDocument> collection = Database.Getdb().GetCollection<BsonDocument>("Identities");
            BsonDocument doc = collection.Find(new BsonDocument("name", "leks secret identity")).First();
            return Ok(doc);
        }
    }
}