using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ProstasiaApi.Controllers
{
    [ApiController]
    public class LoginController : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult> Login()
        {
            

            return Ok();
        }
    }
}