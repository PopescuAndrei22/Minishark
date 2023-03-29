#ifndef PCAPDATA_H
#define PCAPDATA_H
#include <iostream>
#include <vector>

using Seconds = uint32_t;
using Microseconds = uint32_t;
using Elapsed = double;

struct PacketRecord
{
    Seconds seconds;
    Microseconds microseconds;
    uint32_t capturedPacketLength;
    uint32_t originalPacketLength;
    std::vector<uint8_t> packetContent;
};

struct FrontEndData
{
    uint32_t index;
    Elapsed timeElapsed;
    std::string sourceIP;
    std::string destinationIP;
    std::string protocol;
    std::string info;
};

class PcapData
{
private:

    PacketRecord packetRecord;
    FrontEndData frontEndData;

public:

    // setters
    void setPacketRecord(PacketRecord);
    void setFrontEndData(FrontEndData);

    // getters
    PacketRecord getPacketRecord() const;
    FrontEndData getFrontEndData() const;

    uint32_t getOriginalPacketLength() const;

    // constructors
    PcapData();

    // destructors
    ~PcapData();

};

#endif // PCAPDATA_H
