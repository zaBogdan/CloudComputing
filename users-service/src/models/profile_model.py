from .base_model import BaseModel

class ProfileModel(BaseModel):
    def __init__(self,
                email: str = '',
                username: str = '',
                firstName: str = '',
                lastName: str = '',
                bio: str = '',
                contact = [], 
                _id=None):
        super().__init__('profiles')
        self._id = _id
        self.email = email
        self.username = username
        self.firstName = firstName
        self.lastName = lastName
        self.bio = bio
        self.contact = contact