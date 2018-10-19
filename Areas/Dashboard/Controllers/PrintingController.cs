using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace onlk.ploy.web.Areas.Dashboard.Controllers
{
    public class PrintingController : Controller
    {
        //
        // GET: /Dashboard/Customer/
        public ActionResult SaleReport()
        {
            return View();
        }
        public ActionResult PriceList()
        {
            return View();
        }
	}
}