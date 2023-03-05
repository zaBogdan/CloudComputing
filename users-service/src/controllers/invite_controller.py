from core.decorators import request
from core.errors import ExceptionWithStatusCode
from core.responses import SuccessResponse
from service.invite_service import InviteService

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
        show_active = request.query_params.get('active', 'true').lower() == 'true'

        response = InviteService.get_all_invites(
            request.params.get('userId', None),
            show_active
        )
        return SuccessResponse(response), 200

    @request
    def post_new_invite(self, request):
        response = InviteService.create_invite_code(request.params.get('userId', None), request.body)
        return SuccessResponse(response), 201

    @request
    def put_update_invite(self, request):
        response = InviteService.update_invite(request.params.get('userId', None), request.params.get('inviteId', None), request.body)

        return SuccessResponse(response), 200

    @request
    def delete_invite(self, request):
        InviteService.delete_invite(request.params.get('userId', None), request.params.get('inviteId', None))
        return None, 204