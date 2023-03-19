from core.decorators import request
from core.errors import ExceptionWithStatusCode
from core.responses import SuccessResponse
from service.invite_service import InviteService

class InviteController:
    """
    InviteController controller.

    This controller handles all requests to the /user/:userId/invites endpoint.

    Attributes that can be found in request object:
        params - The :userId parameter
        query_params - The query parameters (if any)
        ctx - The context object
        headers - The HTTP headers from the request
        body - The body of the request (if any)
    """
        
    @request
    def get_specific_invite(self, request):
        response = InviteService.get_invite_by_id(
            request.params.get('inviteId', '')
        )
        return SuccessResponse(response), 200

    @request
    def get_disable_specific_invite(self, request):
        response = InviteService.disable_invite_code(
            request.params.get('inviteId', '')
        )
        return SuccessResponse(response), 200

    @request
    def get_all_invites_for_user(self, request):
        show_active = request.query_params.get('active', 'true').lower() == 'true'
        response = InviteService.get_all_invites(
            request.headers.get('X-User', None),
            show_active
        )
        return SuccessResponse(response), 200

    @request
    def post_new_invite(self, request):
        response = InviteService.create_invite_code(request.headers.get('X-User', None), request.body)
        return SuccessResponse(response), 201

    @request
    def put_update_invite(self, request):
        response = InviteService.update_invite(request.headers.get('X-User', None), request.params.get('inviteId', None), request.body)
        return SuccessResponse(response), 200
    
    @request
    def delete_invite(self, request):
        InviteService.delete_invite(request.headers.get('X-User', None), request.params.get('inviteId', None))
        return None, 204