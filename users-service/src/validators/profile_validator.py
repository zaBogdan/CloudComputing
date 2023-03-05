create_profile_schema = {
    "type": "object",
    "properties": {
        "bio": {"type": "string", "minLength": 10},
        "firstName": {"type": "string"},
        "lastName": {"type": "string"},
        "email": {"type": "string", "format": "email"},
        "contact": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "social": {"type": "string", "enum": ["linkedin", "twitter", "facebook", "email", "github"]},
                    "link": {"type": "string", "format": "uri"}
                },
                "required": ["social", "link"]
            },
            "minItems": 2
        }
    },
    "required": ["firstName", "lastName", "email", "contact", "bio"]
}

update_profile_schema = {
    "type": "object",
    "properties": {
        "bio": {"type": "string", "minLength": 10},
        "firstName": {"type": "string"},
        "lastName": {"type": "string"},
        "contact": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "social": {"type": "string", "enum": ["linkedin", "twitter", "facebook", "email", "github"]},
                    "link": {"type": "string", "format": "uri"}
                },
                "required": ["social", "link"]
            },
            "minItems": 2
        }
    },
    "required": ["firstName", "lastName", "contact", "bio"]
}