import jsonschema
from core.responses import ErrorResponse
from core import Logger

def validate_body_middleware(validator_schema):
    def wrapper(request):
        try:
            jsonschema.validate(request.body, validator_schema)
            return True
        except jsonschema.exceptions.ValidationError as e:
            Logger.get_logger().error("Request body is invalid: %s", e)
            return request.send_json(400, ErrorResponse(str(e)))
    return wrapper