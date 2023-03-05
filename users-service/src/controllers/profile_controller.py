from models import ProfileModel
from core.responses import SuccessResponse, ErrorResponse

class ProfileController:
    def __init__(self):
        # self.profile_service = profile_service
        pass

    def get_profile(self, request):
        print(request.params)
        print(request.query_params)
        print(request.ctx)
        print(request.headers)
        print(request.body)
        m = ProfileModel('username', 'first_name', 'last_name', 'bio', 'contact')
        print(m.to_json())
        m.save()
        return request.send_json(200, {
            'message': 'Hello world!'
        })
    
    def post_create_profile(self, request):
        return request.send_json(200, {
            'error': 'Not implemented'
        })
    
    def put_update_profile(self, request):
        return request.send_json(200, ErrorResponse('Not implemented yet'))
    
    def delete_profile(self, request):
        return request.send_json(200, ErrorResponse('Not implemented yet'))