#include "Headers/PcapDeserializer.h"
#include "PcapDeserializer.h"
 
PcapDeserializer::PcapDeserializer(std::string fileName)
{
    this->Read(fileName);
}

void PcapDeserializer::Read(std::string fileName) {
     std::ifstream file("Records3.pcap", std::ios::binary);
     if (!file.is_open()) {
        // handle error opening file
    }

    // skip pcap file header
    file.seekg(24, std::ios::beg);


    std::vector<PacketRecord> packets;
     
    PacketRecord packet;
    
    int k = 0;
    while (file.peek() != EOF) {

       file.read(reinterpret_cast<char*>(&packet.seconds), sizeof(packet.seconds));
       file.read(reinterpret_cast<char*>(&packet.microseconds), sizeof(packet.microseconds));
       file.read(reinterpret_cast<char*>(&packet.capturedPacketLength), sizeof(packet.capturedPacketLength));
       file.read(reinterpret_cast<char*>(&packet.originalPacketLength), sizeof(packet.originalPacketLength));
    

        packet.packetContent.resize(packet.capturedPacketLength);

        // std::cout << std::hex << packet.packetContent.data();
        file.read(reinterpret_cast<char*>(packet.packetContent.data()), packet.capturedPacketLength);

        k++;
        packets.push_back(packet);


        // std::cout << file.tellg() << " ";
    }
    std::cout << k;

    file.close();
}
 
PcapDeserializer::~PcapDeserializer()
{
    //dtor
}