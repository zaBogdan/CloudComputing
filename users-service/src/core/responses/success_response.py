from .default_response import DefaultResponse

class SuccessResponse(DefaultResponse):
    def __init__(self, data, message = 'Successfully processed the request'):
        self.success = True
        self.message = message
        self.data = data



