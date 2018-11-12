# UVFitData Endpoint

## Available Interfaces

### /uvfitdata/ GET

To GET UV Fit data for all devices,
1. "Content-type" header should be set to "application/json"
2. Expected return is a JSON object with the following parameters:
    a) success: boolean
    b) error: string containing error details. exists only if success is false.
    c) submittedData: Array containing all submitted data entries in JSON.

### /uvfitdata/:deviceId/ GET

To GET UV Fit data for a singular device,
1. "Content-type" header should be set to "application/json"
2. :deviceId in the GET address should be the Photon's device ID you are interested in the data for.
3. Expected return is a JSON object with the following parameters:
    a) success: boolean
    b) error: string containing error details. exists only if success is false.
    c) submittedData: Array containing all submitted data entries in JSON for the specified device only.

### /uvfitdata/submit/ POST

To POST new UV Fit Data,
1. "Content-type" header should be set to "application/json"
2. A JSON object in the body should be passed containing the following parameters:
    a) deviceId: string
    b) apiKey: string
    c) gpsX: number
    d) gpsY: number
    e) measuredSpeed: number
    f) measuredUV: number
    g) OPTIONAL timeStamp
3. Expected return is a JSON object with the following parameters:
    a) success: boolean
    b) error: string containing error details. exists only if success is false.
    c) message: string containing outcome.


### /uvfitdata/update/:deviceId/ PUT

### /uvfitdata/delete/:deviceId/ DELETE
