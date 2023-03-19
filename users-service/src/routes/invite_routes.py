from controllers import InviteController
from middleware import validate_body_middleware
from validators import create_invite_link, update_invite_link

class InviteRoutes:

    def __init__(self, server: 'BaseApp'):
        self.server = server

    def add_routes(self):
        self.server.get(
            '/user/invites/:inviteId',
            InviteController().get_specific_invite,
        )
        self.server.get(
            '/user/invites', 
            InviteController().get_all_invites_for_user,
        )
        self.server.get(
            '/user/invites/:inviteId/disable',
            InviteController().get_disable_specific_invite,
            # validate_auth_middleware_internal
        )
        self.server.post(
            '/user/invites', 
            InviteController().post_new_invite,
            validate_body_middleware(create_invite_link)
        )
        self.server.put(
            '/user/invites/:inviteId',
            InviteController().put_update_invite,
            validate_body_middleware(update_invite_link)
        )
        self.server.delete(
            '/user/invites/:inviteId',
            InviteController().delete_invite,
        )