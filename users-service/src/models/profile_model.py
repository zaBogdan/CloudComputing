from .base_model import BaseModel

class ProfileModel(BaseModel):
    def __init__(self, username, first_name, last_name, bio, contact):
        self.username = username
        self.first_name = first_name
        self.last_name = last_name
        self.bio = bio
        self.contact = contact