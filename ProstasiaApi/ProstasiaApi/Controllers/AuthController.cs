﻿using System;
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
                    return Ok(token);
                }

                return StatusCode(403);
            }

            return StatusCode(403);
        }
    }
}