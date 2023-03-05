from core.responses import ErrorResponse
from core.errors import ExceptionWithStatusCode

def request(func):
    def wrapper(self, request):
        try:
            response, code = func(self, request)
            return request.send_json(code, response)
        except ExceptionWithStatusCode as e:
            return request.send_json(e.status_code, ErrorResponse(str(e)))
        except Exception as e:
            return request.send_json(500, ErrorResponse(str(e)))
    return wrapper