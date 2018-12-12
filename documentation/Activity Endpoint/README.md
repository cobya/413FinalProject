# Activity Endpoint

## Available Interfaces

### /activity/ GET

To GET all submitted activities,
1. "Content-type" header should be set to "application/json"
2. Expected return is a JSON object with the following parameters:
    1. success: boolean
    2. error: string containing error details. exists only if success is false.
    3. submittedData: Array containing all submitted data entries in JSON.

### /activity/recent/:deviceId/ GET

To GET activities within the last week for singular device,
1. "Content-type" header should be set to "application/json"
2. :deviceId in the GET address should be the Photon's device ID you are interested in the data for.
3. Expected return is a JSON object with the following parameters:
    1. success: boolean
    2. error: string containing error details. exists only if success is false.
    3. submittedData: Array containing all submitted data entries in JSON for the specified device only.

### /update/:deviceId/:activityId/ PUT

To update an activity's type,
1. "Content-type" header should be set to "application/json"
2. :deviceId in the GET address should be the Photon's device ID you are interested in the data for.
3. :activityId in the GET address should be the activity ID you are interested in the data for.
4. A JSON object in the body should be passed containing the following parameters:
    1. activityType: string
5. Expected return is a JSON object with the following parameters:
    1. success: boolean
    2. error: string containing error details. exists only if success is false.
    3. message: string containing outcome.


### /activity/update/:deviceId/ PUT

### /activity/delete/:deviceId/ DELETE
