from .base_model import BaseModel

class ProfileModel(BaseModel):
    def __init__(self,
                email: str = '',
                username: str = '',
                first_name: str = '',
                last_name: str = '',
                bio: str = '',
                contact = [], 
                _id=None):
        super().__init__('profiles')
        self._id = _id
        self.email = email
        self.username = username
        self.first_name = first_name
        self.last_name = last_name
        self.bio = bio
        self.contact = contact