# UVFit Endpoint

## Available Interfaces

### /uvfit/ GET

To get information on all registered UV Fit devices,
1. "Content-type" header should be set to "application/json"
2. Expected return is a JSON object with the following parameters:
    a) success: boolean
    b) error: string containing error details. exists only if success is false.
    c) uvFitData: Array containing the information for all registered UV Fit devices.

### /uvfit/:deciveId/ GET

To get information on a specific registered UV Fit devices,
1. "Content-type" header should be set to "application/json"
2. :deviceId in the GET address should be the Photon's device ID you are interested in the data for.
3. Expected return is a JSON object with the following parameters:
    a) success: boolean
    b) error: string containing error details. exists only if success is false.
    c) uvFitData: Array containing the information for all registered UV Fit devices.

### /uvfit/register POST

To register a new UV Fit device,
1. "Content-type" header should be set to "application/json"
2. A JSON object in the body should be passed containing the following parameters:
    a) deviceId: string
    b) email: string
    NOTE: The email address must link to a registered account. If there is already a device registered on this account, the POST will return an error.
3. Expected return is a JSON object with the following parameters:
    a) success: boolean
    b) error: string containing error details. exists only if success is false.
    c) message: string containing outcome.

### /uvfit/update/:deviceId/ PUT

### /uvfit/delete/:deviceId/ DELETE
