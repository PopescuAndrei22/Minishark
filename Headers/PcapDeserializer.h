#include <iostream>
#include <vector>
#include <fstream>
#ifndef PCAPDESERIALIZER_H
#define PCAPDESERIALIZER_H



class PcapDeserializer
{
    private:

        // using Seconds = uint32_t;
        // using Microseconds = uint32_t;

        // struct PacketRecord {
        //     Seconds seconds;
        //     Microseconds microseconds;
        //     uint32_t capturedPacketLength;
        //     uint32_t originalPacketLength;
        //     std::vector<uint8_t> packetContent;
        // };
        
        void Read(std::string);

    protected:

    public:
        PcapDeserializer(std::string);
        virtual ~PcapDeserializer();

};

#endif // PCAPDESERIALIZER_H