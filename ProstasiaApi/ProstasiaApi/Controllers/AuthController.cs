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
        
        [Route("/api/auth/logout")]
        [HttpGet]
        public async Task<ActionResult> Logout()
        {
            string token = Request.Cookies["session"];
            User user = SessionManager.Authenticate(token);
            if (user == null) { return BadRequest(); }
            SessionManager.DeleteToken(token); // delete token from sessionmanager
            Response.Cookies.Delete("session"); // expire session cookie
            return Ok();
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