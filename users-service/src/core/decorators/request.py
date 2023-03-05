from core.responses import ErrorResponse
from core.errors import ExceptionWithStatusCode
import traceback

def request(func):
    def wrapper(self, request):
        try:
            response, code = func(self, request)
            return request.send_json(code, response)
        except ExceptionWithStatusCode as e:
            return request.send_json(e.status_code, ErrorResponse(str(e)))
        except Exception as e:
            request.ctx['logger'].debug(e)
            request.ctx['logger'].debug(traceback.print_exc())
            return request.send_json(500, ErrorResponse(str(e)))
    return wrapper