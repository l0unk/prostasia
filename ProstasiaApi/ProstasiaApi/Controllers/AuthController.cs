using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ProstasiaApi.Controllers
{
    [ApiController]
    public class AuthController : ControllerBase
    {
        [Route("api/auth/login")]
        [HttpPost]
        public async Task<ActionResult> Login([FromBody] User user)
        {
            string password = await Database.GetUserPassword(user);

            if (password != null)
            {
                if (user.password == password)
                {
                    string token = SessionManager.CreateToken(user);
                    user.session_vars.Add("username", user.username);
                    Response.Cookies.Append("session", token);
                    return Ok(token);
                }

                return StatusCode(403);
            }

            return StatusCode(403);
        }
        
        [Route("/api/test")]
        [HttpGet]
        public async Task<ActionResult> Test()
        {
            return Ok("The test was successfully tested.");
        }

        [Route("/api/auth")]
        [HttpGet]
        public async Task<ActionResult> Authorize()
        {
            String token = Request.Cookies["session"];
            if (token != null && SessionManager.Authenticate(token) != null)
            {
                return StatusCode(200);
            }

            return StatusCode(403);
        }
    }
}