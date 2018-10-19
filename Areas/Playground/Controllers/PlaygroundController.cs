using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace onlk.ploy.web.Areas.Playground
{
    public class PlaygroundController : Controller
    {
        //
        // GET: /Playground/Playground/
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Editor()
        {
            return View();
        }
        public ActionResult AttachmentContract()
        {
            return View();
        }
   
	}

}