
// This #include statement was automatically added by the Particle IDE.
#include "sysReporter.h"

// This #include statement was automatically added by the Particle IDE.
#include <Adafruit_VEML6070.h>

// This #include statement was automatically added by the Particle IDE.
#include <AssetTracker.h>

//-------------------------------------------------------------------

using namespace std;

//-------------------------------------------------------------------

#define ONE_DAY_MILLIS (24 * 60 * 60 * 1000)
unsigned long lastSync = millis();

//-------------------------------------------------------------------

bool executeStateMachines = false;
 
//-------------------------------------------------------------------

AssetTracker locationTracker = AssetTracker();

//-------------------------------------------------------------------

void stateMachineScheduler() {
    executeStateMachines = true;
    locationTracker.updateGPS();
//    potholeDetector.execute();
    //sysReporter.execute();
}

Timer stateMachineTimer(10, stateMachineScheduler);

//-------------------------------------------------------------------

void responseHandler(const char *event, const char *data) {
    // Formatting output
    String output = String::format("POST Response:\n  %s\n  %s\n", event, data);
    // Log to serial console
    Serial.println(output);
}

//-------------------------------------------------------------------

void setup() {
    Serial.begin(9600);

    // Initialize the gps and turn it on    
    locationTracker.begin();
    locationTracker.gpsOn();
    
    // Handler for response from POSTing location to server
    Particle.subscribe("hook-response/datasubmit", responseHandler, MY_DEVICES);
    
    stateMachineTimer.start();
}    

//-------------------------------------------------------------------

void loop() {

    // Request time synchronization from the Particle Cloud once per day
    if (millis() - lastSync > ONE_DAY_MILLIS) {
        Particle.syncTime();
        lastSync = millis();
    }

    if (executeStateMachines) {
        locationTracker.updateGPS();
        Particle.publish("datasubmit", PRIVATE);
        executeStateMachines = false;
    }
}
