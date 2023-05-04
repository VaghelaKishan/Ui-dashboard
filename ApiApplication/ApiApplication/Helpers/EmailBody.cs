namespace ApiApplication.Helpers
{
    public static class EmailBody
    {
        public static string EmailStringBody(string email, string emailToken) 
        {
            return $@"<html>
        <head>
    </head>
    <body style=""margin:0;padding:;font-family:Arial,Helvetica,sans-serif:"">
    <div style=""margin: 0px; background-color: #f2f3f8;"">
<div>
    <div>
    <h1>Reset Your Password</h1>
    <hr>
    <p>We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.</p>
    
  
    
    <a href =""http://localhost:4200/newpassword?email={email}&code={emailToken}"" target=""_blank"" style=""background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;"">Reset Password</a><br>

    </div>
    </div>
    </div>
    </body>
    </html>"; 
        }
    }
}
