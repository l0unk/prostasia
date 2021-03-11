using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
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
                return StatusCode(403);
            }

            List<Identity> identityList = await Database.GetIdentitiesByUsername(user.username);
            var content = new ContentResult();
            content.Content = JsonConvert.SerializeObject(identityList);
            content.ContentType = "application/json";
            return content;
        }
        
        [Route("/api/identity/{id}/set")]
        [HttpPost]
        public async Task<ActionResult> UpdateIdentity([FromBody] Identity updatedIdentity, string id)
        {
            string token = Request.Cookies["session"];
            List<Object> created = new List<Object>();
            User user = SessionManager.Authenticate(token);
            
            if (user == null)
            {
                return StatusCode(403);
            }

            List<Identity> identityList = await Database.GetIdentitiesByUsername(user.username);
            Identity currentIdentity = identityList.First(x => x._id == ObjectId.Parse(id));
            
            if (currentIdentity == null)
            {
                return BadRequest();
            }

            if (updatedIdentity.identityLabel != null) // Update identity label
            {
                currentIdentity.identityLabel = updatedIdentity.identityLabel;   
            }

            foreach (var password in updatedIdentity.passwords) // Update passwords
            {
                var pass = currentIdentity.passwords.Where(x => x._id == password._id);
                if (pass.Any())
                {
                    var obj = currentIdentity.passwords[currentIdentity.passwords.IndexOf(pass.First())];
                    Console.WriteLine(password.GetType().GetProperties().First().ToString());
                    foreach (var prop in password.GetType().GetProperties())
                    {
                        var value = prop.GetValue(password);
                        if (value != null)
                        {
                            prop.SetValue(obj, value);
                        }
                    }
                }
                else
                {
                    currentIdentity.passwords.Add(password);
                    created.Add(password);
                    
                }
            }
            
            foreach (var note in updatedIdentity.secureNotes) // Update secure notes
            {
                var pass = currentIdentity.secureNotes.Where(x => x._id == note._id); // get note with same id
                if (pass.Any()) // if it exists
                {
                    var obj = currentIdentity.secureNotes[currentIdentity.secureNotes.IndexOf(pass.First())];
                    Console.WriteLine(note.GetType().GetProperties().First().ToString());
                    foreach (var prop in note.GetType().GetProperties())
                    {
                        var value = prop.GetValue(note);
                        if (value != null)
                        {
                            prop.SetValue(obj, value);
                        }
                    }
                }
                else
                {
                    currentIdentity.secureNotes.Add(note);
                    created.Add(note);
                }
            }

            await Database.UpdateIdentity(currentIdentity);

            if (created.Any())
            {
                return Ok(created);
            }
            
            return Ok();
        }
        
        [Route("/api/identity/{id}/replace")]
        [HttpPost]
        public async Task<ActionResult> ReplaceIdentity([FromBody] Identity updatedIdentity, string id)
        {
            string token = Request.Cookies["session"];
            User user = SessionManager.Authenticate(token);
            
            if (user == null)
            {
                return StatusCode(403);
            }

            updatedIdentity._id = ObjectId.Parse(id);

            await Database.UpdateIdentity(updatedIdentity);

            return Ok();
        }
    }
}