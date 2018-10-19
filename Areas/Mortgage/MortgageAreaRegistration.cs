using System.Web.Mvc;

namespace onlk.ploy.web.Areas.Mortgage
{
    public class MortgageAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Mortgage";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Mortgage_default",
                "Mortgage/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );

            context.MapRoute(
               "Mortgage_homedefault",
               "Mortgage",
               new { controller = "Unit", action = "Index", id = UrlParameter.Optional }
           );
        }
    }
}