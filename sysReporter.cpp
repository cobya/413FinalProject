 #include "sysReporter.h"
    #include <AssetTracker.h>
    #include "FitnessDetector.h"
    #include <vector>
    #include <cstdlib>
    #include <stdlib.h>
    #include <time.h>

    #define DEBUG
    
    sysReporter::sysReporter(FitnessDetector &theDetector) :
    fitnessDetector(theDetector) {
        tick = 0;
        state = S_Wait;
        led2 = D7; 
        pinMode(led2, OUTPUT);
        button = BTN;
        state = S_Wait;
        check = 0;
        activityId = 0;
        deviceId = "280033001247363336383437";
    }
    
void sysReporter::execute() {
    String postData;

    switch (state) {
        case sysReporter::S_Wait:
            tick = 0;
            activityId = 0;
            digitalWrite(led2, LOW);
            fitnessDetector.checkUV();
            //delay(250);
            //Serial.println("Wait");           
            if(fitnessDetector.isDetected()) { 
                state = sysReporter::S_Publish;
            }
            else {
                state = sysReporter::S_Wait;
            }
            break;

        case sysReporter::S_Publish:
            //srand(time(NULL));
            if(Particle.connected()) {
            activityId = fitnessDetector.getActivity();
                for (check = 0; check < fitnessDetector.returnFitness(); check++) {
		           postData = String::format("{\"gpsX\": \"%f\", \"gpsY\": \"%f\", \"measuredUV\": \"%d\",\"measuredSpeed\": \"%f\", \"activityId\": \"%d\"}", fitnessDetector.getLongitude().at(check), fitnessDetector.getLatitude().at(check), fitnessDetector.getUV().at(check), fitnessDetector.getSpeed().at(check), activityId);
	            	Particle.publish("datasubmit", postData, PRIVATE);
	            	Serial.println(postData); //ADD THIS BACK
		            delay(250);
		        }
                fitnessDetector.setReported();
                //Serial.println("Should be 0");
                //Serial.println(fitnessDetector.isDetected());
            }
            state = sysReporter::S_LedNotify;
            break;

        case sysReporter::S_LedNotify:
            //digitalWrite(led2, HIGH);
            ++tick;
            //Serial.println("hello");
            //fitnessDetector.makeZero();
            // Keep LED on for 2 seconds
            if (tick == 200) {
                state = sysReporter::S_Wait;
            }
            else {
                state = sysReporter::S_LedNotify;
            }
            break;
    }
}

string sysReporter::getDeviceId() {
    return this->deviceId;
}

string sysReporter::getApiKey() {
    return this->apiKey;  
}


//-------------------------------------------------------------------

