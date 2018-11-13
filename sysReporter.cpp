    #include "sysReporter.h"
    // This #include statement was automatically added by the Particle IDE.
    #include <AssetTracker.h>
    
    #define DEBUG
    
    sysReporter::sysReporter(AssetTracker &theTracker) :
    gpsSensor(theTracker) {
        tick = 0;
        state = S_Wait;
        led = D7; 
        pinMode(led, OUTPUT);
    }
    
void sysReporter::execute() {
    String postData;

#ifdef DEBUG
    Serial.print("sysReporter SM: ");
    Serial.println(state);
#endif

    switch (state) {
        case sysReporter::S_Wait:
            tick = 0;
            digitalWrite(led, LOW);
            
            state = sysReporter::S_Publish;
            break;

        case sysReporter::S_Publish:
            if (gpsSensor.gpsFix()) {
               postData = String::format("{ \"longitude\": \"%f\", \"latitude\": \"%f\" }", 
                                         gpsSensor.readLonDeg(), gpsSensor.readLatDeg());
            }
            else {
               postData = String::format("{ \"longitude\": \"%f\", \"latitude\": \"%f\" }", 
                                         -110.987420, 32.248820);
            }

            Serial.println(postData);
            Particle.publish("dataSubmit", postData);
 
            
            state = sysReporter::S_LedNotify;
            break;

        case sysReporter::S_LedNotify:
            digitalWrite(led, HIGH);
            ++tick;

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
