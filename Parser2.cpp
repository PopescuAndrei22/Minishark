#include <fstream>
#include <iostream>
#include <cstdint>
#include <vector>
#include <iomanip>
#include <string>

struct PacketRecord {
    uint32_t seconds;
    uint32_t microseconds;
    uint32_t capturedPacketLength;
    uint32_t originalPacketLength;
    std::vector<uint8_t> packetContent;
};

int main() {
    const char* filename = "example.pcap";

    std::ifstream file(filename, std::ios::binary);
    if (!file) {
        std::cerr << "Failed to open file " << filename << std::endl;
        return 1;
    }

    // Parse pcap file header
    uint32_t magicNumber, versionMajor, versionMinor, thiszone, sigfigs, snaplen, network;
    file.read(reinterpret_cast<char*>(&magicNumber), sizeof(magicNumber));
    file.read(reinterpret_cast<char*>(&versionMajor), sizeof(versionMajor));
    file.read(reinterpret_cast<char*>(&versionMinor), sizeof(versionMinor));
    file.read(reinterpret_cast<char*>(&thiszone), sizeof(thiszone));
    file.read(reinterpret_cast<char*>(&sigfigs), sizeof(sigfigs));
    file.read(reinterpret_cast<char*>(&snaplen), sizeof(snaplen));
    file.read(reinterpret_cast<char*>(&network), sizeof(network));

    // Check endianness of the file
    bool littleEndian = (magicNumber == 0xa1b2c3d4);
    if (!littleEndian && magicNumber != 0xd4c3b2a1) {
        std::cerr << "Invalid pcap file format" << std::endl;
        return 1;
    }

    // Loop over packet records
    std::vector<PacketRecord> packets;
    while (file) {
        // Parse packet header
        uint32_t ts_sec, ts_usec, incl_len, orig_len;
        file.read(reinterpret_cast<char*>(&ts_sec), sizeof(ts_sec));
        file.read(reinterpret_cast<char*>(&ts_usec), sizeof(ts_usec));
        file.read(reinterpret_cast<char*>(&incl_len), sizeof(incl_len));
        file.read(reinterpret_cast<char*>(&orig_len), sizeof(orig_len));

        // Check for end of file
        if (!file) {
            break;
        }

        // Convert timestamps to seconds and microseconds
        uint32_t seconds = littleEndian ? ts_sec : __builtin_bswap32(ts_sec);
        uint32_t microseconds = littleEndian ? ts_usec : __builtin_bswap32(ts_usec);

        // Read packet content
        std::vector<uint8_t> content(incl_len);
        file.read(reinterpret_cast<char*>(content.data()), incl_len);

        // Create packet record
        packets.emplace_back(PacketRecord{seconds, microseconds, incl_len, orig_len, content});
    }

    // Print packet records
    for (const auto& packet : packets) {
        std::cout << "Timestamp: " << packet.seconds << "." << packet.microseconds << std::endl;
        std::cout << "Captured packet length: " << packet.capturedPacketLength << std::endl;
        std::cout << "Original packet length: " << packet.originalPacketLength << std::endl;
        std::cout << "Packet content: ";
        for (const auto& byte : packet.packetContent) {
            std::cout << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(byte);
        
        }
    }
}
