#include <fstream>
#include <vector>
#include <iostream>

struct PacketRecord {
    uint32_t seconds;
    uint32_t microseconds;
    uint32_t capturedPacketLength;
    uint32_t originalPacketLength;
    std::vector<uint8_t> packetContent;
};

int main() {
    std::ifstream file("mypcap.pcap", std::ios::binary);

    if (!file.is_open()) {
        // handle error opening file
    }

    // skip pcap file header
    file.seekg(24, std::ios::beg);


    std::vector<PacketRecord> packets;
     
    PacketRecord packet;
    

    while (file.good()) {

       file.read(reinterpret_cast<char*>(&packet.seconds), sizeof(packet.seconds));
       file.read(reinterpret_cast<char*>(&packet.microseconds), sizeof(packet.microseconds));
       file.read(reinterpret_cast<char*>(&packet.capturedPacketLength), sizeof(packet.capturedPacketLength));
       file.read(reinterpret_cast<char*>(&packet.originalPacketLength), sizeof(packet.originalPacketLength));

        packet.packetContent.resize(packet.capturedPacketLength);

        std::cout << std::hex << packet.packetContent.data();
        file.read(reinterpret_cast<char*>(packet.packetContent.data()), sizeof(packet.packetContent.data()));



        packets.push_back(packet);


        // std::cout << file.tellg() << " ";
    }

    file.close();

    // process packets
    // ...
    // std::cout << packets.size();
    for (const auto& packet : packets) {
        std::cout << "Seconds: " << packet.seconds << std::endl;
        std::cout << "Microseconds: " << packet.microseconds << std::endl;
        std::cout << "Captured Packet Length: " << packet.capturedPacketLength << std::endl;
        std::cout << "Original Packet Length: " << packet.originalPacketLength << std::endl;
        std::cout << "Packet Content: ";

        // for (const auto& byte : packet.packetContent) {
        //     std::cout << std::hex << static_cast<int>(byte) << " ";
        // }

        std::cout << std::dec << std::endl << std::endl;
    }

    return 0;
}
