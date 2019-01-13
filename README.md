# NodeBB: Simple Login

Simple API endpoint for external login. Special use case: external login check if user's credentials are valid.

![Version](https://img.shields.io/npm/v/nodebb-plugin-ns-login.svg)

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
"email:confirmed": 1,
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

## Using plugin as internal REST API

Whenever used as internal API disable IP limiter in `userDefence` instance of `express-brute`.

```
userDefence.getMiddleware({
    // Disregard IP address when matching requests if set to true
    // Set true if API is used internaly from few IPs
    ignoreIP: true, 
    key: function (req, res, next) {
        // prevent too many attempts for the same username
        next(req.body.username);
    }
})
```

## Additional information

- It is simple
- It has brute-force defence. The brute-force counter resets on successful login.
