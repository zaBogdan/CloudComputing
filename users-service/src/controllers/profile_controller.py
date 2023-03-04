class ProfileController:
    def __init__(self):
        # self.profile_service = profile_service
        pass

    def get_profile(self, request):
        print(request.params)
        print(request.query_params)
        print(request.ctx)
        return request.send_json(200, {
            'message': 'Hello world!'
        })
        pass
        # return self.profile_service.get_profile(user_id)

    def update_profile(self, user_id, profile):
        pass
        # return self.profile_service.update_profile(user_id, profile)