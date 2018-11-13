#ifndef SYS_REPORTER_H
#define SYS_REPORTER_H

//-------------------------------------------------------------------

#include <AssetTracker.h>

//-------------------------------------------------------------------

class sysReporter {
   enum State { S_Wait, S_Publish, S_LedNotify };

private:
    int rate;

private:
    State state;
    int tick;
    int led;
    AssetTracker& gpsSensor;

public:
    sysReporter(AssetTracker &theTracker);    
    void execute();
};

//-------------------------------------------------------------------

#endif
