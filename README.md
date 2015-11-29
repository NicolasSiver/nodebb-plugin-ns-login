# NodeBB: Simple Login

Simple API endpoint for external login. Special use case: external login check if user's credentials are valid.

![Version](https://img.shields.io/npm/v/nodebb-plugin-ns-login.svg)
![Dependencies](https://david-dm.org/NicolasSiver/nodebb-plugin-ns-login.svg)
![bitHound Score](https://www.bithound.io/github/NicolasSiver/nodebb-plugin-ns-login/badges/score.svg)
![Code Climate](https://img.shields.io/codeclimate/github/NicolasSiver/nodebb-plugin-ns-login.svg)

## API

Plugin adds additional API endpoint.

    [POST] https://YourBoardDomain.com/api/ns/login
    
### Properties:

- `username` [String] - Required field. It could be username or email. It uses internal NodeBB methods to resolve.
- `password` [String] - Required field.

### Result:

Successful login returns user data, it looks like:

```js
{
"_key": "user:1",
"username": "Nicolas",
"userslug": "nicolas",
"email": "nicolas@email.com",
"joindate": 1432379229517,
"picture": "https://secure.gravatar.com/avatar/16e774e25b68ab1d41d2cc269a29983a?size=128&default=identicon&rating=pg",
"gravatarpicture": "https://secure.gravatar.com/avatar/16e774e25b68ab1d41d2cc269a29983a?size=128&default=identicon&rating=pg",
"fullname": "",
"location": "",
"birthday": "",
"website": "",
"signature": "",
"uploadedpicture": "",
"profileviews": 0,
"reputation": 0,
"postcount": 0,
"topiccount": 0,
"lastposttime": 0,
"banned": 0,
"status": "online",
"uid": 1,
"passwordExpiry": 0,
"lastonline": 1432379559871
}
```

## Additional information

- It is simple
- It has brute-force defence
