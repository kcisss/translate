using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace onlk.ploy.web.Areas.m.Controllers
{
    public class AuthController : Controller
    {
        [AllowAnonymous]
        // GET: m/Auth
        public ActionResult Index()
        {
            return View();
        }
    }
}