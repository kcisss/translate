using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace onlk.ploy.web.Areas.MortgageDashboard.Controllers
{
    public class DefaultController : Controller
    {
        // GET: MortgageDashboard/Default
        public ActionResult Index()
        {
            return View();
        }
    }
}