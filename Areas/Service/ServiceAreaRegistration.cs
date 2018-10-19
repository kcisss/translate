using System.Web.Mvc;

namespace onlk.ploy.web.Areas.Service
{
    public class ServiceAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Service";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Service_default",
                "Service/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );

           // context.MapRoute(
           //    "Service_Home",
           //    "Service",
           //    new { controller="Home",action = "Index", id = UrlParameter.Optional }
           //);
        }
    }
}