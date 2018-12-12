#ifndef SYS_REPORTER_H
#define SYS_REPORTER_H

//-------------------------------------------------------------------

#include <AssetTracker.h>
#include <vector>
//#include <Adafruit_VEML6070.h>
#include "FitnessDetector.h"
#include "sysReporter.h"
#include <stdlib.h>
#include <time.h>
#include <cstdlib>

//-------------------------------------------------------------------

class sysReporter {
   enum State { S_Wait, S_Publish, S_LedNotify };

private:
    int rate;

private:
    State state;
    int tick;
    int led2;
    int button;
    int check;
    int activityId;
    string deviceId;
    string apiKey;
    FitnessDetector& fitnessDetector;

public:
    sysReporter(FitnessDetector &theDetector);
    string getDeviceId();
    string getApiKey();
    void execute();
};

//-------------------------------------------------------------------

#endif
