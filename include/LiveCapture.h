#ifndef LIVECAPTURE_H
#define LIVECAPTURE_H
#include <iostream>
#include <iomanip>
#include <vector>
#include <pcap.h>
#include "PcapData.h"

#define MAX_PACKETS 1

class LiveCapture 
{
    private:
        std::vector<char*> interfaceNames;

        std::vector<PacketRecord> capturedPackets;

        char* currentNetworkInterface;

    public:
        /* getters */
        std::vector<PacketRecord> getCapturedPackets();
        std::vector<char*> getInterfaceNames();
        int getNumberOfPackets();

        void getNetworkInterfaces();
        void selectNetworkInterface(int);
        void captureLivePackets();

        void printInterfaces();

        LiveCapture();
        ~LiveCapture();
};

#endif // LIVECAPTURE_H