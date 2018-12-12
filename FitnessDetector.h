#ifndef FITNESS_DETECTOR_H
#define FITNESS_DETECTOR_H

//-------------------------------------------------------------------

#include <vector>
#include <AssetTracker.h>
#include <Adafruit_VEML6070.h>

//-------------------------------------------------------------------

using namespace std;

//-------------------------------------------------------------------

class FitnessDetector {
   enum State { S_Wait, S_Sample, S_Chill, S_Detected, S_WaitUntilReported };

private:
    State state;
    int tick;
    int numSamples;
    vector<int> accelSamples;
    int sampleIndex;
    int size;
    int totalUV;
    int uvThresh;
    int fitnessSize;
    bool FitnessDetected;
    float avgMagnitude;
    AssetTracker& gpsSensor;
    Adafruit_VEML6070& uvSensor;
    std::vector<float> longitude;
	std::vector<float> latitude;
	std::vector<int> uv;
	std::vector<float> gpsSpeed;
    String postData;
    int button;
    int led;
    int activityId;

public:
    FitnessDetector(AssetTracker &theTracker, Adafruit_VEML6070 &theSensor);
    int setUVThresh(int uvHigh);
    std::vector<float> getLongitude();
    std::vector<float> getLatitude();
    std::vector<int> getUV();
    std::vector<float> getSpeed();
    bool isDetected(); 
    void checkUV();
    void setReported();  
    int returnFitness();
    void execute();
    int getActivity();
};

//-------------------------------------------------------------------

#endif
