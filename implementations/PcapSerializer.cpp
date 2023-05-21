#include "../include/PcapSerializer.h"

void PcapSerializer::savePcap(std::vector<PacketRecord> packets)
{
    std::string pcapFileName = "test";

    pcap_t* pcapHandle;
    char errbuf[PCAP_ERRBUF_SIZE];

    // Open the pcap file for writing
    pcapHandle = pcap_open_dead(DLT_EN10MB, 65535);  // DLT_EN10MB is for Ethernet link type
    if (pcapHandle == nullptr) {
        // Error handling
        return;
    }

    // Create a pcap dump file for writing
    pcap_dumper_t* pcapDumper = pcap_dump_open(pcapHandle, pcapFileName.c_str());
    if (pcapDumper == nullptr) {
        // Error handling
        pcap_close(pcapHandle);
        return;
    }

    // Write each packet to the capture file
    for (const auto& packetRecord : packets) {
        struct pcap_pkthdr pcapHeader;
        pcapHeader.ts.tv_sec = packetRecord.seconds;
        pcapHeader.ts.tv_usec = packetRecord.microseconds;
        pcapHeader.caplen = packetRecord.capturedPacketLength;
        pcapHeader.len = packetRecord.originalPacketLength;

        // Write the packet header and data to the pcap dump file
        pcap_dump(reinterpret_cast<u_char*>(pcapDumper), &pcapHeader, packetRecord.packetContent.data());
    }

    // Close the pcap dump file and cleanup
    pcap_dump_close(pcapDumper);
    pcap_close(pcapHandle);
}

void PcapSerializer::init(std::string filePath)
{
    this->filePath = filePath;
}

// constructors
PcapSerializer::PcapSerializer()
{

}

// destructors
PcapSerializer::~PcapSerializer()
{

}
