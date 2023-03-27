#include <fstream>
#include <vector>
#include <iostream>
#include "Headers/PcapDeserializer.h"

struct PacketRecord {
    uint32_t seconds;
    uint32_t microseconds;
    uint32_t capturedPacketLength;
    uint32_t originalPacketLength;
    std::vector<uint8_t> packetContent;
};

int main() {
    std::ifstream file("Records3.pcap", std::ios::binary);

    PcapDeserializer ob;

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

    // process packets
    // ...
    //std::cout << packets.size();
    // int nr = 0;
    // for (const auto& packet : packets) {
    //     nr++;
    //     if(nr < 7400) continue;
    //     std::cout << "Nr: " << nr << std::endl;
    //     std::cout << "Seconds: " << packet.seconds << std::endl;
    //     std::cout << "Microseconds: " << packet.microseconds << std::endl;
    //     std::cout << "Captured Packet Length: " << packet.capturedPacketLength << std::endl;
    //     std::cout << "Original Packet Length: " << packet.originalPacketLength << std::endl;
    //     std::cout << "Packet Content: ";

    //     uint32_t dstIp = (packet.packetContent[30] << 24) | (packet.packetContent[31] << 16) | (packet.packetContent[32] << 8) | packet.packetContent[33];
    //     std::cout << "Destination IP: " << ((dstIp >> 24) & 0xff) << "." << ((dstIp >> 16) & 0xff) << "." << ((dstIp >> 8) & 0xff) << "." << (dstIp & 0xff) << std::endl;


    //     for (const auto& byte : packet.packetContent) {
    //         // std::cout << std::hex << static_cast<int>(byte) << " ";
    //     }

    //     std::cout << std::dec << std::endl << std::endl;
    //  }
    return 0;
}