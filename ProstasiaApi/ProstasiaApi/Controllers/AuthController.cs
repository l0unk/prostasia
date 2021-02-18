using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ProstasiaApi.Controllers
{
    [ApiController]
    public class LoginController : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult> Login([FromForm] string username, string inputpass)
        {
            string password = await Database.GetUserPassword(username);

            if (inputpass == password)
            {
                return Ok();
            }
            
            

            return Ok();
        }
    }
}