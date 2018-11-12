# UVFitData Endpoint

## Available Interfaces

### /uvfitdata/ GET

To GET UV Fit data for all devices,
1. "Content-type" header should be set to "application/json"
2. Expected return is a JSON object with the following parameters:
    1. success: boolean
    2. error: string containing error details. exists only if success is false.
    3. submittedData: Array containing all submitted data entries in JSON.

### /uvfitdata/:deviceId/ GET

To GET UV Fit data for a singular device,
1. "Content-type" header should be set to "application/json"
2. :deviceId in the GET address should be the Photon's device ID you are interested in the data for.
3. Expected return is a JSON object with the following parameters:
    1. success: boolean
    2. error: string containing error details. exists only if success is false.
    3. submittedData: Array containing all submitted data entries in JSON for the specified device only.

### /uvfitdata/submit/ POST

To POST new UV Fit Data,
1. "Content-type" header should be set to "application/json"
2. A JSON object in the body should be passed containing the following parameters:
    1. deviceId: string
    2. apiKey: string
    3. gpsX: number
    4. gpsY: number
    5. measuredSpeed: number
    6. measuredUV: number
    7. OPTIONAL timeStamp
3. Expected return is a JSON object with the following parameters:
    1. success: boolean
    2. error: string containing error details. exists only if success is false.
    3. message: string containing outcome.


### /uvfitdata/update/:deviceId/ PUT

### /uvfitdata/delete/:deviceId/ DELETE
