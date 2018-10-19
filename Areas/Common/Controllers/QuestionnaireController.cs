using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace onlk.ploy.web.Areas.Common.Controllers
{
    public class QuestionnaireController : Controller
    {
        // GET: Common/Questionnaire
        public ActionResult Form()
        {
            return View();
        }
        public ActionResult List()
        {
            return View();
        }
        public ActionResult RawData()
        {
            return View();
        }
    }
}