class InviteController:
    def __init__(self):
        pass
    
    def get_specific_invite(self, request):
        return request.send_json(200, {
            'error': 'Not implemented'
        })

    def get_all_invites_for_user(self, request):
        return request.send_json(200, {
            'error': 'Not implemented'
        })
        # return self.invite_service.get_all_invites_for_user(user_id)

    def post_new_invite(self, request):
        return request.send_json(200, {
            'error': 'Not implemented'
        })
        # return self.invite_service.post_new_invite(invite)

    def put_update_invite(self, request):
        return request.send_json(200, {
            'error': 'Not implemented'
        })
        # return self.invite_service.put_update_invite(invite_id, invite)

    def delete_invite(self, request):
        return request.send_json(200, {
            'error': 'Not implemented'
        })
        # return self.invite_service.delete_invite(invite_id) 