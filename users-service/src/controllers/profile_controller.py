from models import ProfileModel
from core.decorators import request
from core.errors import ExceptionWithStatusCode
from core.responses import SuccessResponse

class ProfileController:
    def __init__(self):
        # self.profile_service = profile_service
        pass

    @request
    def get_profile(self, request):
        print(request.params)
        print(request.query_params)
        print(request.ctx)
        print(request.headers)
        print(request.body)
        m = ProfileModel('username', 'first_name', 'last_name', 'bio', 'contact')
        print(m.to_json())
        m.save()
        return SuccessResponse(None, 'Profile retrieved successfully'), 200
    
    @request
    def post_create_profile(self, request):
        raise ExceptionWithStatusCode('Not implemented yet', 409)
    
    @request
    def put_update_profile(self, request):
        raise ExceptionWithStatusCode('Not implemented yet', 409)
    
    @request
    def delete_profile(self, request):
        raise ExceptionWithStatusCode('Not implemented yet', 409)