using System.Web.Mvc;

namespace onlk.ploy.web.Areas.Common
{
    public class CommonAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Common";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Common_default",
                "Common/PivotAnalysis/{action}",
                new { controller = "PivotAnalysis", action = "Index" }
            );

        }
    }
}