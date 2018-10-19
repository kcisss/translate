using System.Web.Mvc;

namespace onlk.ploy.web.Areas.Playground
{
    public class PlaygroundAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Playground";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            

            context.MapRoute("Playground_index", "Playground", new { controller = "Playground", action = "Index" });
            context.MapRoute(
                "Playground_default",
                "Playground/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional });
        }
    }
}