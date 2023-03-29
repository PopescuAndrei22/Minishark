#include "../include/PcapData.h"

// setters
void PcapData::setPacketRecord(PacketRecord packetRecord)
{
    this->packetRecord = packetRecord;
}

void PcapData::setFrontEndData(FrontEndData frontEndData)
{
    this->frontEndData = frontEndData;
}

// getters
PacketRecord PcapData::getPacketRecord() const
{
    return this->packetRecord;
}

FrontEndData PcapData::getFrontEndData() const
{
    return this->frontEndData;
}

uint32_t PcapData::getOriginalPacketLength() const 
{
    return this->packetRecord.originalPacketLength;
}

// constructors
PcapData::PcapData()
{

}

// destructors
PcapData::~PcapData()
{

}
