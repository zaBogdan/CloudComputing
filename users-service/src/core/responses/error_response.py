from .default_response import DefaultResponse

class ErrorResponse(DefaultResponse):
    def __init__(self, message):
        self.success = False
        self.message = message