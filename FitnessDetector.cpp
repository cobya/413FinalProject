  //-------------------------------------------------------------------

#include "FitnessDetector.h"
#include <AssetTracker.h>
#include "sysReporter.h"
//#include <Adafruit_VEML6070.h>

//-------------------------------------------------------------------

#define DEBUG

//-------------------------------------------------------------------

FitnessDetector::FitnessDetector(AssetTracker &theTracker, Adafruit_VEML6070 &theSensor) :
    gpsSensor(theTracker), uvSensor(theSensor) {    
        
    size = 0;
    fitnessSize = 0;
    totalUV = 0;
    tick = 0;
    sampleIndex = 0;
    uvThresh = 100;
    FitnessDetected = false;
    state = S_Wait;
    button = BTN;
    led = D7;
    pinMode(led, OUTPUT);
    activityId = 0;
}

//-------------------------------------------------------------------

void FitnessDetector::execute() {
    switch (state) {
        case FitnessDetector::S_Wait:
            sampleIndex = 0;
            totalUV = 0;
            digitalWrite(led, LOW);
            if (digitalRead(button) == 0) {
                delay(1000);
                activityId = Time.now();
                //activityId = 1200;
                state = FitnessDetector::S_Sample;
                Serial.println("Button pressed");
            }
            else {
                state = FitnessDetector::S_Wait;
            }
            break;

        case FitnessDetector::S_Sample: //collect
            tick = 0;
            digitalWrite(led, HIGH);
            if (gpsSensor.gpsFix()) {
                longitude.push_back(gpsSensor.readLonDeg());
			    latitude.push_back(gpsSensor.readLatDeg());
			    gpsSpeed.push_back(gpsSensor.getSpeed());
			    uv.push_back(uvSensor.readUV());
			    totalUV += uvSensor.readUV();
			    size++;	
              }
            else {
                longitude.push_back(110.9501);
			    latitude.push_back(32.2319);
			    gpsSpeed.push_back(1.8);
			    uv.push_back(uvSensor.readUV());
			    totalUV += uvSensor.readUV();
			    size++;
               }
            Serial.println(postData);
            //accelSamples.at(sampleIndex) = accelSensor.readXYZmagnitude();
            state = FitnessDetector::S_Chill;
            break;
            
        case FitnessDetector::S_Chill:
            digitalWrite(led, HIGH);
            ++tick;
            if (tick == 100) {
                if (digitalRead(button) == 0) {
                    fitnessSize = size;
                    state = FitnessDetector::S_Detected;
                    Serial.println("Button pressed again!");
                }
                else {
                    state = FitnessDetector::S_Sample;
                }
                
            }
            else {
                state = FitnessDetector::S_Chill;
            }
            break;

        case FitnessDetector::S_Detected:
            FitnessDetected = true;
            digitalWrite(led, LOW);
            totalUV = 0;
                                RGB.control(true);
                    RGB.color(0, 128, 0); //green
                    RGB.brightness(200);
            ++tick;
            if (tick == 200) {
                state = FitnessDetector::S_WaitUntilReported;
            }
            else {
                state = FitnessDetector::S_Detected;
            }
            break;

        case FitnessDetector::S_WaitUntilReported:
        tick = 0;
            if (FitnessDetected == true) {
                state = FitnessDetector::S_WaitUntilReported;
            }
            else {
                state = FitnessDetector::S_Wait;
            }
            break;
    }
}

//-------------------------------------------------------------------

bool FitnessDetector::isDetected() {
    return this->FitnessDetected;
}

//-------------------------------------------------------------------

void FitnessDetector::setReported() {
    FitnessDetected = false;
}

int FitnessDetector::returnFitness() {
    return fitnessSize;
}



void FitnessDetector::checkUV() {
    if(totalUV > uvThresh) { //user is above UV threshold, warn them with red light
        RGB.control(true);
        RGB.color(255, 0, 0); //red
        RGB.brightness(200);
    }
    else { //user is below UV threshold, light is a light green so it is calm
        RGB.control(true);
        RGB.color(0, 128, 0); //green
        RGB.brightness(200);
    }
}

int FitnessDetector::setUVThresh(int uvHigh) {
    this->uvThresh = uvHigh;
    return(0);
}

int FitnessDetector::getActivity() {
    return this->activityId;
}

std::vector<float> FitnessDetector::getLongitude() {
    return this->longitude;
}

std::vector<float> FitnessDetector::getLatitude() {
    return this->latitude;  
}

std::vector<int> FitnessDetector::getUV() {
    return this->uv;
}

std::vector<float> FitnessDetector::getSpeed() {
    return this->gpsSpeed;
}
//-------------------------------------------------------------------
