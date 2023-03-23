#include <fstream>
#include <iostream>
#include <cstdint>
#include <vector>
#include <iomanip>
#include <string>

using Seconds = std::uint32_t;
using Microseconds = std::uint32_t;

struct PcapHeader {
    uint32_t magic_number;
    uint16_t version_major;
    uint16_t version_minor;
    int32_t thiszone;
    uint32_t sigfigs;
    uint32_t snaplen;
    uint32_t network;
};

struct PacketHeader {
    Seconds seconds;
    Microseconds microseconds;
    uint32_t incl_len;
    uint32_t orig_len;
};

struct PacketRecord {
    Seconds seconds;
    Microseconds microseconds;
    uint32_t capturedPacketLength;
    uint32_t originalPacketLength;
    std::vector<uint8_t> packetContent;
};

int main() {
    std::ifstream file("Records.pcap", std::ios::binary);

    if (!file) {
        std::cerr << "Error opening file" << std::endl;
        return 1;
    }

    // read the PCAP file header
    PcapHeader pcap_header;
    file.read(reinterpret_cast<char*>(&pcap_header), sizeof(pcap_header));

    // check the magic number to ensure the file is a PCAP file
    if (pcap_header.magic_number != 0xa1b2c3d4 && pcap_header.magic_number != 0xd4c3b2a1 && pcap_header.magic_number != 0xa1b23c4d && pcap_header.magic_number != 0xd4c3b2a1) {
        std::cerr << "Not a valid PCAP file" << std::endl;
        return 1;
    }

    std::vector<PacketRecord> packetRecords;

    // read packets from the file
    PacketRecord packet_record;
    PacketHeader packet_header;
    while (!file.eof()) {
        
        file.read(reinterpret_cast<char*>(&packet_header), sizeof(packet_header));

        std::cout << sizeof(packet_header);


        // allocate a buffer for the packet data
        std::vector<uint8_t> packet_data(packet_header.incl_len);
        file.read(reinterpret_cast<char*>(packet_data.data()), packet_header.incl_len);

        // create a packet record and store it in the vector
        
        packet_record.seconds = packet_header.seconds;
        packet_record.microseconds = packet_header.microseconds;
        packet_record.capturedPacketLength = packet_header.incl_len;
        packet_record.originalPacketLength = packet_header.orig_len;
        packet_record.packetContent = packet_data;

        packetRecords.push_back(packet_record);
    }

    // process the packet records
    for (const auto& packet_record : packetRecords) {
        std::cout << "Packet content: ";

        // access the packet content as a vector of bytes
        for (const auto& byte : packet_record.packetContent) {
            // print each byte in hexadecimal notation
            //std::cout << std::hex << std::setfill('0') << std::setw(2) << static_cast<int>(byte);
        }

        std::cout << std::endl;
    }


    // close the file
    file.close();

    return 0;
}
