using System.ComponentModel.DataAnnotations;

namespace ApiApplication.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string middlename { get; set; }
        public string gender { get; set; }
        public decimal phone { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string date { get; set; }
        public decimal Age { get; set; }
        public string Qualification { get; set; }
        public string address { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string profile { get; set; }
        public string[] checkarray { get; set; }

        public string Role { get; set; }

        public string Token { get; set; }

        public string RefreshToken { get; set; } 
        public DateTime RefreshTokenExpiryTime { get; set; } 

        public string ResetPasswordToken { get; set; }
        private DateTime resetPasswordExpiry;

        public DateTime ResetPasswordExpiry
        {
            get { return resetPasswordExpiry; }
            set { resetPasswordExpiry = value.ToUniversalTime(); }
        }









        public class Login
        {
            public string email { get; set; }
            public string password { get; set; }

        }
    }
}
