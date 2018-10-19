using onlk.ploy.common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace onlk.ploy.web.Areas.Example.Controllers
{
    public class ApiExceptionController : ApiController
    {
        public void GetError(int id, string msg)
        {
            var type = "";
            switch (id)
            {
                case 1:
                    type = "DataValidateException";
                    if (string.IsNullOrEmpty(msg))
                    {
                        throw new DataValidateException(errmsg(type));
                    }

                    throw new DataValidateException(msg);
                case 2:
                    type = "ValidateServiceException";
                    try
                    {
                        if (string.IsNullOrEmpty(msg))
                        {
                            throw new ValidateServiceException(errmsg(type));
                        }
                        throw new ValidateServiceException(msg);
                    }
                    catch (Exception e)
                    {

                        throw e;
                    }

                case 3:
                    type = "SaveNotCompleteException";

                    if (string.IsNullOrEmpty(msg))
                    {
                        throw new SaveNotCompleteException(null, errmsg(type));
                    }

                    throw new SaveNotCompleteException(null, msg);
                case 4:
                    try
                    {
                        type = "UnsupportedMediaTypeException";
                        if (string.IsNullOrEmpty(msg))
                        {
                            throw new onlk.ploy.common.UnsupportedMediaTypeException(errmsg(type));
                        }

                        throw new onlk.ploy.common.UnsupportedMediaTypeException(msg);
                    }
                    catch (Exception e)
                    {

                        throw new Exception("See inner exception", e);
                    }

                case 5:
                    type = "NotFoundReferenceDocNotExistException";
                    if (string.IsNullOrEmpty(msg))
                    {
                        throw new NotFoundReferenceDocNotExistException(errmsg(type));
                    }

                    throw new NotFoundReferenceDocNotExistException(msg);
             
                case 6:
                    type = "NotFoundSQLCommandException";
                    if (string.IsNullOrEmpty(msg))
                    {
                        throw new NotFoundSQLCommandException(errmsg(type));
                    }

                    throw new NotFoundSQLCommandException(msg);
                case 7:
                    type = "NotImplementedException";
                    if (string.IsNullOrEmpty(msg))
                    {
                        throw new NotImplementedException(errmsg(type));
                    }

                    throw new NotImplementedException(msg);
                case 8:
                    type = "Exception";
                    break;
                default:
                    type = "PlainException";
                    break;
            }
            if (string.IsNullOrEmpty(msg))
            {
                throw new Exception(errmsg(type));
            }

            throw new Exception(msg);
        }

        private string errmsg(string type)
        {
            return string.Format("This is Test Server Error Exception with Errortype {0}", type);

        }
    }
}
