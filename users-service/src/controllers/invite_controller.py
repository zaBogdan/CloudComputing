from core.decorators import request
from core.errors import ExceptionWithStatusCode
from core.responses import SuccessResponse

class InviteController:
    def __init__(self):
        pass

    @request
    def get_specific_invite(self, request):
        return SuccessResponse({
            'error': 'Not implemented'
        }), 200

    @request
    def get_all_invites_for_user(self, request):
        raise ExceptionWithStatusCode('Not implemented yet', 409)

    @request
    def post_new_invite(self, request):
        return SuccessResponse({
            'error': 'Not implemented'
        }), 200

    @request
    def put_update_invite(self, request):
        return SuccessResponse({
            'error': 'Not implemented'
        }), 200

    @request
    def delete_invite(self, request):
        return SuccessResponse({
            'error': 'Not implemented'
        }), 200