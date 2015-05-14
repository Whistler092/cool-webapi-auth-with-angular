using AngularJSAuthentication.API.App_Start;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace AngularJSAuthentication.API.Providers
{
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        //Now generating the token happens behind the scenes when we call “context.Validated(identity)”.
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            //Valida el cliente - 
            context.Validated();
        }

        //Encargado de validad el nombre de usuario y contraseña enviados en el punto final del servidor de Autenticación
        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            //return base.GrantResourceOwnerCredentials(context);
            
            //To allow CORS on the token middleware provider we need to add the header “Access-Control-Allow-Origin” to Owin context
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });

            using (AuthRepository _repo = new AuthRepository())
            {
                IdentityUser user = await _repo.FindUser(context.UserName, context.Password);
                if(user == null)
                {
                    context.SetError("Invalid_Grant", "El nombre de usuario o contraseña es incorrecto");
                    return;
                }
            }

            //Se le agregan 2 reglas. 
            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            identity.AddClaim(new Claim("sub", context.UserName));
            identity.AddClaim(new Claim("role", "user"));

            context.Validated(identity);
        }
    }
}