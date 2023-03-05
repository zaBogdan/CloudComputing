from core.responses import ErrorResponse

def request(func):
    def wrapper(self, request):
        try:
            response, code = func(self, request)
            return request.send_json(code, response)
        except Exception as e:
            return request.send_json(e.status_code or 500, ErrorResponse(str(e)))
    return wrapper