from core.errors import ExceptionWithStatusCode
from core import Logger
from models import ProfileModel, InviteModel

class ProfileService:
    @staticmethod
    def get_profile(user_id: int) -> None:
        profile = ProfileModel().find({
            'username': user_id
        })

        if profile is None:
            raise ExceptionWithStatusCode('Profile not found', 404)
        
        return profile
    
    @staticmethod
    def create_profile(user_id: int, body: dict) -> None:
        email = body.get('email', '')
        profile_exists = ProfileModel().find({
            '$or': [
                { 'email': email },
                { 'username': user_id },            
            ] 
        })

        if profile_exists is not None:
            raise ExceptionWithStatusCode('Profile already exists', 409)
        
        body['username'] = user_id
        
        new_profile = ProfileModel(**body)
        new_profile.save()

        return new_profile
    
    @staticmethod
    def update_profile(user_id: int, body: dict) -> None:
        profile = ProfileModel().find({
            'username': user_id
        })

        if profile is None:
            raise ExceptionWithStatusCode('Profile not found', 404)
        
        if body.get('bio', None) is not None:
            profile.bio = body.get('bio')
        
        if body.get('contact', None) is not None:
            profile.contact = body.get('contact')
        
        if body.get('firstName', None) is not None:
            profile.firstName = body.get('firstName')
        
        if body.get('lastName', None) is not None:
            profile.lastName = body.get('lastName')

        profile.save()

        return profile

    @staticmethod
    def delete_profile(user_id: int) -> None:
        profile = ProfileModel().find({
            'username': user_id
        })
        if profile is None:
            raise ExceptionWithStatusCode('Profile not found', 404)
        
        invites = InviteModel().find_many({
            'user_id': profile._id
        })
        for invite in list(invites):
            invite = InviteModel(**invite)
            Logger.get_logger().info(f'Deleting invite code with id \'{invite.invite_code}\' ')
            invite.delete()
        
        profile.delete()
        return None