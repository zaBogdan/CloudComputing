from models import ProfileModel
from core.decorators import request
from core.errors import ExceptionWithStatusCode
from core.responses import SuccessResponse

from service.profile_service import ProfileService

class ProfileController:
    """
    Profile controller.

    This controller handles all requests to the /user/:userId/profile endpoint.

    Attributes that can be found in request object:
        params - The :userId parameter
        query_params - The query parameters (if any)
        ctx - The context object
        headers - The HTTP headers from the request
        body - The body of the request (if any)
    """
    
    @request
    def get_profile(self, request):
        response = ProfileService.get_profile(request.params.get('userId', None))
        return SuccessResponse(response), 200
    
    @request
    def post_create_profile(self, request):
        response = ProfileService.create_profile(request.params.get('userId', None), request.body)
        return SuccessResponse(response), 201
    
    @request
    def put_update_profile(self, request):
        response = ProfileService.update_profile(request.params.get('userId', None), request.body)
        return SuccessResponse(response), 200
    
    @request
    def delete_profile(self, request):
        ProfileService.delete_profile(request.params.get('userId', None))
        return None, 204