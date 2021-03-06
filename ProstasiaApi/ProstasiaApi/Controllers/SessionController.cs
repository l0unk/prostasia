﻿using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using JsonConvert = Newtonsoft.Json.JsonConvert;

namespace ProstasiaApi.Controllers
{
    [Route("/api/session")]
    [ApiController]
    [Produces("application/json")]
    public class SessionController : ControllerBase
    {
        [Route("/api/session/variables/get")]
        [HttpGet]
        public async Task<ActionResult>  GetVariables()
        {
            if (Request.Cookies["session"] == null)
            {
                return StatusCode(400);
            }
            User user = SessionManager.Authenticate(Request.Cookies["session"]);
            Console.WriteLine(Request.Cookies["session"]);
            if (user == null)
            {
                return StatusCode(403);
            }
            ContentResult content = new ContentResult();
            content.Content = JsonConvert.SerializeObject(user.session_vars);
            content.ContentType = "application/json";
            Console.WriteLine($"Real: {string.Join("", user.session_vars)}");
            Console.WriteLine($"Fake: {content.Content.ToString()}");
            return content;
        }

        [Route("/api/session/variables/set")]
        [HttpPost]
        public async Task<ActionResult> SetVariable(JsonElement variable)
        {
            JObject thingie = JObject.Parse(variable.ToString());
            //var converter = new ExpandoObject();
            //dynamic obj = JsonConvert.DeserializeObject<ExpandoObject>();
            User user = SessionManager.Authenticate(Request.Cookies["session"]);

            if (user == null)
            {
                return StatusCode(403);

            }

            foreach (JProperty key in thingie.Properties())
            {
                if (user.session_vars.ContainsKey(key.Name))
                {
                    user.session_vars[key.Name] = key.Value;
                } else
                {
                    user.session_vars.Add(key.Name, key.Value);
                }
            }

            return Ok();
        }
    }
}