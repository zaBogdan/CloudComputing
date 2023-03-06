from controllers import ProfileController
from middleware import validate_body_middleware, validate_auth_middleware
from validators import create_profile_schema, update_profile_schema

class ProfileRoutes:
    def __init__(self, server: 'BaseApp'):
        self.server = server
    
    def add_routes(self):
        self.server.get(
            '/user/:userId/profile',
            ProfileController().get_profile,
            validate_auth_middleware
        )
        self.server.post(
            '/user/:userId/profile',
            ProfileController().post_create_profile,
            validate_auth_middleware,
            validate_body_middleware(create_profile_schema)
        )
        self.server.put(
            '/user/:userId/profile',
            ProfileController().put_update_profile,
            validate_auth_middleware,
            validate_body_middleware(update_profile_schema)
        )
        self.server.delete(
            '/user/:userId/profile',
            ProfileController().delete_profile,
            validate_auth_middleware
        )