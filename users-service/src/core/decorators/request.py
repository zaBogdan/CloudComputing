from core.responses import SuccessResponse, ErrorResponse

def request(func):
    def wrapper(self, request):
        try:
            response, code = func(self, request)
            return request.send_json(code, SuccessResponse(**response))
        except Exception as e:
            return request.send_json(e.status_code or 500, ErrorResponse(str(e)))
    return wrapper