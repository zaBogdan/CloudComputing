from models import ProfileModel
from core.decorators import request
from core.errors import ExceptionWithStatusCode
from core.responses import SuccessResponse

from service.profile_service import ProfileService

class ProfileController:
    @request
    def get_profile(self, request):
        response = ProfileService.get_profile(request.params.get('userId', None))
        return SuccessResponse(response), 200
    
        # print(request.params)
        # print(request.query_params)
        # print(request.ctx)
        # print(request.headers)
        # print(request.body)
        # m = ProfileModel('username', 'first_name', 'last_name', 'bio', 'contact')
        # print(m.to_json())
        # m.save()
        # return SuccessResponse(None, 'Profile retrieved successfully'), 200
    
    @request
    def post_create_profile(self, request):
        response = ProfileService.create_profile(request.params.get('userId', None), request.body)
        return SuccessResponse(response), 201
    
    @request
    def patch_update_profile(self, request):
        response = ProfileService.update_profile(request.params.get('userId', None), request.body)
        return SuccessResponse(response), 200
    
    @request
    def delete_profile(self, request):
        ProfileService.delete_profile(request.params.get('userId', None))
        return None, 204