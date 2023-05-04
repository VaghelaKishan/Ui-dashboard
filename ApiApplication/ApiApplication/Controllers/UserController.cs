using ApiApplication.Context;
using ApiApplication.Helpers;
using ApiApplication.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using System;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using static ApiApplication.Models.User;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Org.BouncyCastle.Crypto.Fpe;
using ApiApplication.UtilityService;
using ApiApplication.Models.Dto;

namespace ApiApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        public UserController(AppDbContext appDbContext,IConfiguration configuration, IEmailService emailService) 
        {
            _authContext= appDbContext;
            _configuration= configuration;
            _emailService= emailService;
        }

        //[Authorize]
        //[HttpGet]
        //public async Task<ActionResult<List<User>>> Get()
        //{
        //    return Ok(await _authContext.Users.ToListAsync());
        //}

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<User>> GetAllUsers()
        {
            return Ok(await _authContext.Users.ToListAsync());
        }

        //[HttpGet("{id}")]
        //public async Task<ActionResult<User>> Get(int id)
        //{
        //    var user = await _authContext.Users.FindAsync(id);
        //    if (user == null)
        //        return BadRequest("User not found");
        //    return Ok(user);
        //}

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserByEmail(int id)
        {

            // Retrieve the requested user's data from the database
            var user = await _authContext.Users.FirstOrDefaultAsync(u => u.Id == id);

            // Check if the user exists
            if (user == null || user.Id != id)
            {
                return NotFound();
            }

            return Ok(user);

        }


        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] Login userobj)
        {
            if(userobj == null)
                return BadRequest();

            var user = await _authContext.Users
                .FirstOrDefaultAsync(x => x.email == userobj.email);

            if(user == null)
                return NotFound(new {Message = "User Not Found! "});

            if (!PasswordHasher.VerifyPassword(userobj.password, user.password))
                return BadRequest(new { Message = "Password Doesn't Match" });


            user.Token = CreateJwt(user);

        
            //await _authContext.SaveChangesAsync();

            //return Ok(new
            //{
            //    Token = user.Token,
            //    Message = "Login Successfully"
            //});
            var newAccessToken = user.Token; 
            var newRefreshToken = CreateRefreshToken();
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(5);
            await _authContext.SaveChangesAsync();

            return Ok(new TokenApiDto()
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            });

        }




        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User userobj)
        {
            if(userobj==null)
                return BadRequest();
            

            // Chech Email
            if (await CheckEmailExitsAsync(userobj.email))
                return BadRequest(new { Message = "Email Already Exist!" });


            // Chech Password Strength
            var pass = CheckpasswordStrengh(userobj.password);
            if (!string.IsNullOrEmpty(pass))
                return BadRequest(new { Message = pass.ToString() });


            userobj.password = PasswordHasher.HashPassword(userobj.password);
            userobj.Role = "User";
            userobj.Token = "";
            await _authContext.Users.AddAsync(userobj);
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                Message = "User Registered!"
            });


        }

        
        
        private  Task<bool> CheckEmailExitsAsync(string email)
        {
            return _authContext.Users.AnyAsync(x=>x.email == email );
        }

        private string CheckpasswordStrengh(string Password)
        {
            StringBuilder sb= new StringBuilder();
            if (Password.Length < 8)
                sb.Append("Minimum Password length should br 8" + Environment.NewLine);
            if (!(Regex.IsMatch(Password, "[a-z]") && Regex.IsMatch(Password, "[A-Z]")
                && Regex.IsMatch(Password, "[0-9]")))
                sb.Append("Password should be Alphanumeric" + Environment.NewLine);
            if (!Regex.IsMatch(Password, "[<,>,@,&,!,#,$,%,^,*,(,),_,+,\\[,\\],{,},?,:,;,|,',\\,.,/,`,~,-,=]")) 
                sb.Append("Password should be contain special chars" +Environment.NewLine);
            return sb.ToString();

        }

        private string CreateJwt(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("VaghelaKishanishere");
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Name,$"{user.firstname}  {user.lastname}"),
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.UtcNow.AddMinutes(60),
                SigningCredentials = credentials,
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }

        //-------------
        private string CreateRefreshToken()
        {
            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var refreshToken = Convert.ToBase64String(tokenBytes);

            var tokenInUser = _authContext.Users
                .Any(a => a.RefreshToken == refreshToken);
            if (tokenInUser)
            {
                return CreateRefreshToken();
            }
            return refreshToken;
        }

        private ClaimsPrincipal GetPrincipleFromExpiredToken(string token)
        {
            var key = Encoding.ASCII.GetBytes("VaghelaKishanishere");
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateLifetime = false,
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("This is Invalid Token");
            return principal;
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody]TokenApiDto tokenApiDto)
        {
            if (tokenApiDto is null)
                return BadRequest("Invalid Client Request");
            string accessToken = tokenApiDto.AccessToken;
            string refreshToken = tokenApiDto.RefreshToken;
            var principal = GetPrincipleFromExpiredToken(accessToken);
            var name = principal.Identity.Name;
            var user = await _authContext.Users.FirstOrDefaultAsync(u => u.firstname == name);
            if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                return BadRequest("Invalid Request");
            var newAccessToken = CreateJwt(user);
            var newRefreshToken = CreateRefreshToken();
            user.RefreshToken = newRefreshToken;
            await _authContext.SaveChangesAsync();

            return Ok(new TokenApiDto()
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
            });
        }//--------------------------

        [HttpPost("send-reset-email/{email}")]
        public async Task<IActionResult>SendEmail(string email)
        {
            var user= await _authContext.Users.FirstOrDefaultAsync(a=> a.email == email);
            if(user is null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "email Doesn't Exist"
                });
            }
            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var emailToken = Convert.ToBase64String(tokenBytes);
            user.ResetPasswordToken = emailToken;
            user.ResetPasswordExpiry = DateTime.Now.AddMinutes(15);
            string from = _configuration["EmailSettings:From"];
            var emailModel = new EmailModel(email, "Reset Password!!", EmailBody.EmailStringBody(email, emailToken));
            _emailService.SendEmail(emailModel);
            _authContext.Entry(user).State = EntityState.Modified;
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Email Sent!"
            });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var newToken = resetPasswordDto.EmailToken.Replace(" ", "+");
            var user = await _authContext.Users.AsNoTracking().FirstOrDefaultAsync(a => a.email == resetPasswordDto.Email);
            if (user is null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "User Doesn't Exist"
                });
            }
            var tokenCode = user.ResetPasswordToken;
            DateTime emailTokenExpiry = user.ResetPasswordExpiry;
            if(tokenCode != resetPasswordDto.EmailToken || emailTokenExpiry < DateTime.UtcNow)
            {
                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = "Invalid Reset Link"
                });
            }
            user.password = PasswordHasher.HashPassword(resetPasswordDto.NewPassword);
            _authContext.Entry(user).State = EntityState.Modified;
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Password Reset Successfully"
            });
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var user = await _authContext.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            _authContext.Users.Remove(user);
            await _authContext.SaveChangesAsync();

            return NoContent();
        }

        //[HttpPut("{id}")]
        //public async Task<IActionResult> UpdateItem(int id, [FromBody] User updatedItem)
        //{
        //    var user = await _authContext.Users.FindAsync(id);

        //    if (user == null)
        //    {
        //        return NotFound();
        //    }

        //    user.firstname = updatedItem.firstname;
        //    user.email = updatedItem.email;
        //    user.phone = updatedItem.phone;
        //    user.gender = updatedItem.gender;
        //    user.date = updatedItem.date;




        //    _authContext.Users.Update(user);
        //    _authContext.Users.Update(user);
        //    _authContext.Users.Update(user);
        //    _authContext.Users.Update(user);
        //    _authContext.Users.Update(user);


        //    await _authContext.SaveChangesAsync();
            
        //    return NoContent();
        //}

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] User updatedItem)
        {
            var user = await _authContext.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            user.firstname = updatedItem.firstname;
            user.lastname = updatedItem.lastname;
            user.email = updatedItem.email;
            user.phone = updatedItem.phone;
            user.date = updatedItem.date;
            user.Age = updatedItem.Age;
            user.Qualification = updatedItem.Qualification;




            _authContext.Users.Update(user);



            await _authContext.SaveChangesAsync();

            return NoContent();
        }


    }
}
