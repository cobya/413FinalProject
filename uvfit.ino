// This #include statement was automatically added by the Particle IDE.
#include "FitnessDetector.h"


// This #include statement was automatically added by the Particle IDE.
#include "sysReporter.h"
// This #include statement was automatically added by the Particle IDE.
//#include <Adafruit_VEML6070.h>

// This #include statement was automatically added by the Particle IDE.
#include <AssetTracker.h>
//#include <Adafruit_VEML6070.h>
    #include <cstdlib>
    #include <stdlib.h>
    #include <time.h>
    
    

//-------------------------------------------------------------------

using namespace std;


SYSTEM_THREAD(ENABLED);

//-------------------------------------------------------------------

#define ONE_DAY_MILLIS (24 * 60 * 60 * 1000)
unsigned long lastSync = millis();

//-------------------------------------------------------------------

bool executeStateMachines = false;
bool running = false;
 
//-------------------------------------------------------------------

AssetTracker locationTracker = AssetTracker();
Adafruit_VEML6070 uv = Adafruit_VEML6070();
FitnessDetector FitnessDetector(locationTracker, uv);
sysReporter sysReporter(FitnessDetector);
int button = BTN;

//-------------------------------------------------------------------

void stateMachineScheduler() {
    executeStateMachines = true;
}

Timer stateMachineTimer(10, stateMachineScheduler);

//-------------------------------------------------------------------

void responseHandler(const char *event, const char *data) {
    // Formatting output
    String output = String::format("POST Response:\n  %s\n  %s\n", event, data);
    // Log to serial console
    Serial.println(output);
}


int pingHandler(String data) {
    int newPosition;

    newPosition = atoi(data.c_str());
    FitnessDetector.setUVThresh(newPosition);

    return 0;
}

//-------------------------------------------------------------------

void setup() {
    Serial.begin(9600);
    
    pinMode(button, INPUT);
    
    uv.begin(VEML6070_2_T);
    
    // Initialize the gps and turn it on    
    locationTracker.begin();
    locationTracker.gpsOn();
    
    Particle.connect();
    
    Particle.function("pingDevice", pingHandler);
    // Handler for response from POSTing location to server
    Particle.subscribe("hook-response/datasubmit", responseHandler, MY_DEVICES);
    
    stateMachineTimer.start();
}    

//-------------------------------------------------------------------

void loop() {

            if (millis() - lastSync > ONE_DAY_MILLIS) {
                Particle.syncTime();
                lastSync = millis();
            }

            if (executeStateMachines) {
              locationTracker.updateGPS();
              sysReporter.execute();
              FitnessDetector.execute();
              executeStateMachines = false;
             }
        
    
}
