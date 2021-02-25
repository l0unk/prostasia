using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using JsonConvert = Newtonsoft.Json.JsonConvert;

namespace ProstasiaApi.Controllers
{
    [Route("/api/identity")]
    [ApiController]
    [Produces("application/json")]
    public class IdentityController : ControllerBase
    {
        [Route("/api/identity/create")]
        [HttpPost]
        public async Task<ActionResult> CreateIdentity([FromBody] Identity identity)
        {
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

            if (string.IsNullOrWhiteSpace(identity.identityLabel))
            {
                return StatusCode(400);
            }
            
            identity.ownerUsername = user.username;

            await Database.CreateIdentity(identity);
            
            return Ok("my friend it literally fuckin worked!");
        }

        [Route("/api/identity/get")]
        [HttpGet]
        public async Task<ActionResult> GetIdentities()
        {
            string token = Request.Cookies["session"];
            User user = SessionManager.Authenticate(token);
            
            if (user == null)
            {
                return BadRequest();
            }

            List<Identity> identityList = await Database.GetIdentitiesByUsername(user.username);
            var content = new ContentResult();
            content.Content = JsonConvert.SerializeObject(identityList);
            content.ContentType = "application/json";
            return content;
        }
    }
}