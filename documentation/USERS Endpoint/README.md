# Users Endpoint

## Available Interfaces

### /users/ GET

To get information on all registered users,
1. "Content-type" header should be set to "application/json"
2. Expected return is a JSON object with the following parameters:
    1. success: boolean
    2. error: string containing error details. exists only if success is false.
    3. registeredUsers: Array containing the information for all registered users.

### /users/:email/ GET

To get information on a registered user,
1. "Content-type" header should be set to "application/json"
2. :email in the GET address should be the user's email you are interested in the data for.
3. Expected return is a JSON object with the following parameters:
    1. success: boolean
    2. error: string containing error details. exists only if success is false.
    3. registeredUsers: Array containing the information for all registered users.

### /users/register POST

To register a new account,
1. "Content-type" header should be set to "application/json"
2. A JSON object in the body should be passed containing the following parameters:
    1. password: string
    2. email: string
    3. fullName: string
    NOTE: The email address must not link to a registered account. If there is already a registered account, the POST will return an error.
3. Expected return is a JSON object with the following parameters:
    1. success: boolean
    2. error: string containing error details. exists only if success is false.
    3. message: string containing outcome.

### /users/update/:email/ PUT

### /users/delete/:email/ DELETE
