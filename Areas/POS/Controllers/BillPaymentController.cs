using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace onlk.ploy.web.Areas.POS.Controllers
{
    public class BillPaymentController : Controller
    {
        // GET: POS/BillPayment
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Form()
        {
            return View();
        }
    }
}