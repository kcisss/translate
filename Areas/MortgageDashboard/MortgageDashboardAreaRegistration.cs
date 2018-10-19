using System.Web.Mvc;

namespace onlk.ploy.web.Areas.MortgageDashboard
{
    public class MortgageDashboardAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "MortgageDashboard";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "MortgageDashboard_default",
                "MortgageDashboard/{action}/{id}",
                new { controller = "Default", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}