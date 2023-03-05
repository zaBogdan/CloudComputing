create_invite_link = {
    "type": "object",
    "properties": {
        "email": {"type": "string", "format": "email"},
        "expireIn": {"type": "string", "pattern": "^[1-9][0-9]*[dhms]$"}
    },
    "required": ["email", "expireIn"]
}

update_invite_link = {
    "type": "object",
    "properties": {
        "active": { "type": "boolean" },
    },
    "required": ["active"]
}