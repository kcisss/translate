using System.Web.Mvc;

namespace onlk.ploy.web.Areas.ListManager
{
    public class ListManagerAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "ListManager";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "ListManager_AllNew_Setting",
                "ListManager/{controller}/{action}/{id}",
                new { controller = "Settings", action = "Index", id = UrlParameter.Optional });
            context.MapRoute(
                "ListManager_Setting_CompanyForm",
                "ListManager/{controller}/Company/Form",
                new { controller = "setting", action = "CompanyForm" });
            context.MapRoute(
                "ListManager_Setting_UserForm",
                "ListManager/{controller}/User/Form",
                new { controller = "setting", action = "UserForm" });

            context.MapRoute(
                "ListManager_default",
                "ListManager/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional });
        }
    }
}