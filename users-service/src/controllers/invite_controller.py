from core.decorators import request
from core.errors import ExceptionWithStatusCode

class InviteController:
    def __init__(self):
        pass

    @request
    def get_specific_invite(self, request):
        return {
            'message': 'Hello world',
            'data': {
                'error': 'Not implemented'
            }
        }, 200

    @request
    def get_all_invites_for_user(self, request):
        raise ExceptionWithStatusCode('Not implemented yet', 409)

    def post_new_invite(self, request):
        return request.send_json(200, {
            'error': 'Not implemented'
        })

    def put_update_invite(self, request):
        return request.send_json(200, {
            'error': 'Not implemented'
        })

    def delete_invite(self, request):
        return request.send_json(200, {
            'error': 'Not implemented'
        })