using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace onlk.ploy.web.Areas.developercenter.Controllers
{
    [AllowAnonymous]
    public class DefaultController : Controller
    {
        // GET: developercenter/Default
        public ActionResult Index()
        {
            return View();
        }
    }
}