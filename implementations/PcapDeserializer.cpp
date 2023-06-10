#include "../include/PcapDeserializer.h"

// function that gets the info field
std::string PcapDeserializer::getInfo(const PacketRecord& packet) const
{
    uint8_t protocol = packet.packetContent[23];
    std::string info;

    /* to modify this function to add more protocols
    */

    /* protocols that we could add:
    - UDP
    - TCP
    - RTCP
    - TLSv1.2
    - ARP
    - DNS
    - MDNS
    - QUICK
    */

    if (protocol == 6)   // TCP
        {
            uint16_t srcPort = (packet.packetContent[34] << 8) | packet.packetContent[35];
            uint16_t dstPort = (packet.packetContent[36] << 8) | packet.packetContent[37];
            uint8_t flags = packet.packetContent[47];

            if (srcPort == 53 || dstPort == 53)
                {
                    // DNS is encapsulated in TCP

                    // Extract the TCP header length from the TCP header
                    uint8_t tcpHeaderLength = (packet.packetContent[46] >> 4) * 4;

                    // Extract DNS information from the packet payload
                    // Start by skipping the TCP and IP headers
                    uint8_t* dnsPayload = const_cast<uint8_t*>(&packet.packetContent[14 + tcpHeaderLength]); // Assuming Ethernet header length of 14 bytes

                    // Extract the query ID from the DNS packet header
                    uint16_t queryId = (dnsPayload[0] << 8) | dnsPayload[1];

                    // Perform DNS packet parsing and extraction
                    // Extract other DNS fields such as flags, etc.

                    // Construct the "Info" field
                    std::ostringstream oss;
                    oss << "DNS (TCP) - Query ID: " << queryId << ", Flags: " << flags;
                    info = oss.str();
                }
                else
                {
                    // Construct the "Info" field
                    std::ostringstream oss;
                    oss << "TCP " << srcPort << " → " << dstPort;
                    if (flags & 0x02) oss << " [SYN]";
                    if (flags & 0x10) oss << " [ACK]";
                    if (flags & 0x01) oss << " [FIN]";
                    info = oss.str();
                }
        }
    else if (protocol == 17)     // UDP
        {
            uint16_t srcPort = (packet.packetContent[34] << 8) | packet.packetContent[35];
            uint16_t dstPort = (packet.packetContent[36] << 8) | packet.packetContent[37];

            if (srcPort == 53 || dstPort == 53)
            {
                // DNS is encapsulated in UDP

                // Extract DNS information from the packet payload
                // Start by skipping the UDP and IP headers
                uint8_t* dnsPayload = const_cast<uint8_t*>(&packet.packetContent[14 + 8]); // Assuming Ethernet header length of 14 bytes and UDP header length of 8 bytes

                // Extract the query ID from the DNS packet header
                uint16_t queryId = (dnsPayload[0] << 8) | dnsPayload[1];

                // Extract the flags from the DNS packet header
                uint16_t flags = (dnsPayload[2] << 8) | dnsPayload[3];

                // Perform DNS packet parsing and extraction
                // Extract other DNS fields as needed

                // Construct the "Info" field
                std::ostringstream oss;
                oss << "DNS (UDP) - Query ID: " << queryId << ", Flags: " << flags;
                info = oss.str();
            }
            else
            {
                // Construct the "Info" field
                std::ostringstream oss;
                oss << "UDP " << srcPort << " → " << dstPort;
                info = oss.str();
            }
        }
    else if (protocol == 1)     // ICMP
        {
            uint8_t type = packet.packetContent[34];
            uint8_t code = packet.packetContent[35];

            // Construct the "Info" field
            std::ostringstream oss;
            oss << "ICMP type " << static_cast<int>(type) << " code " << static_cast<int>(code);
            info = oss.str();
        }
    else if (protocol == 88)    // ICMPv6
    {
        uint8_t type = packet.packetContent[34];
        uint8_t code = packet.packetContent[35];

        // Construct the "Info" field
        std::ostringstream oss;
        oss << "ICMPv6 type " << static_cast<int>(type) << " code " << static_cast<int>(code);
        info = oss.str();
    }
    else if (protocol == 53)    // DNS
    {
        // Extract DNS information from the packet
        uint16_t queryId = (packet.packetContent[34] << 8) | packet.packetContent[35];
        uint16_t flags = (packet.packetContent[36] << 8) | packet.packetContent[37];
        // Extract other DNS fields as needed

        // Construct the "Info" field
        std::ostringstream oss;
        oss << "DNS - Query ID: " << queryId << ", Flags: " << flags;
        info = oss.str();
    }


    else if (protocol == 123)   // NTP
    {
        // Extract NTP information from the packet
        // Extract other NTP fields as needed

        // Construct the "Info" field
        std::ostringstream oss;
        oss << "NTP";
        info = oss.str();
    }
    else if (protocol == 138 || protocol == 139)   // NetBIOS
    {
        // Extract NetBIOS information from the packet
        // Extract other NetBIOS fields as needed

        // Construct the "Info" field
        std::ostringstream oss;
        oss << "NetBIOS";
        info = oss.str();
    }
    else if (protocol == 161)   // SNMP
    {
        // Extract SNMP information from the packet
        // Extract other SNMP fields as needed

        // Construct the "Info" field
        std::ostringstream oss;
        oss << "SNMP";
        info = oss.str();
    }
    else if (protocol == 50)    // ESP
    {
        // Extract ESP information from the packet
        // Extract other ESP fields as needed

        // Construct the "Info" field
        std::ostringstream oss;
        oss << "ESP";
        info = oss.str();
    }
    else if (protocol == 0)     // IP
    {
        // Extract IP information from the packet
        // Extract other IP fields as needed

        // Construct the "Info" field
        std::ostringstream oss;
        oss << "IP";
        info = oss.str();
    }
    else
    {
        // Construct the "Info" field
        std::ostringstream oss;
        oss << "Unknown protocol " << static_cast<int>(protocol);
        info = oss.str();
    }

    return info;
}

// function to get the protocol name based on int value
std::string PcapDeserializer::getProtocolName(const PacketRecord& packet) const
{
    uint8_t protocol = packet.packetContent[23];

    uint16_t srcPort = (packet.packetContent[34] << 8) | packet.packetContent[35];
    uint16_t dstPort = (packet.packetContent[36] << 8) | packet.packetContent[37];

    static const std::unordered_map<uint8_t, std::string> protocolMap
    {
        { 1, "ICMP" },
        { 6, "TCP" },
        { 17, "UDP" },
        { 88, "ICMPv6" },
        { 50, "ESP" },
        { 53, "DNS" },
        { 123, "NTP" },
        { 138, "NetBIOS" },
        { 139, "NetBIOS" },
        { 161, "SNMP" },
        { 162, "SNMP" },
        { 194, "IRC" },
        { 80, "HTTP"},
        { 68, "DHCP"},
        { 67, "DHCP"},
        { 443, "HTTPS"},
        // Add more protocol mappings here as needed
    };

    if(protocol == 6 || protocol == 17)
    {
        for (const auto& entry : protocolMap) {
            uint8_t protocolNumber = entry.first;
            std::string protocolName = entry.second;
            
            // Process the key-value pair

            if(srcPort == (static_cast<int>(protocolNumber)) || dstPort == (static_cast<int>(protocolNumber)))
            {
                return protocolName;
            }
        }
        // if(srcPort == 53 || dstPort == 53)
        // {
        //     return "DNS";
        // }
    }

    auto it = protocolMap.find(protocol);
    if (it != protocolMap.end())
        {
            return it->second;
        }
    else
        {
            return "Unknown";
        }
}

// reading pcap file and getting Packet Record
void PcapDeserializer::readFile(std::string fileName)
{
    // opening the file
    std::ifstream file(fileName, std::ios::binary);

    if (!file.is_open())
        {
            // handle error opening file
        }

    // skip pcap file header
    file.seekg(24, std::ios::beg);

    PacketRecord packet;
    // reading the pcap file to get the Packet Record
    while (file.peek() != EOF)
        {
            file.read(reinterpret_cast<char*>(&packet.seconds), sizeof(packet.seconds));
            file.read(reinterpret_cast<char*>(&packet.microseconds), sizeof(packet.microseconds));
            file.read(reinterpret_cast<char*>(&packet.capturedPacketLength), sizeof(packet.capturedPacketLength));
            file.read(reinterpret_cast<char*>(&packet.originalPacketLength), sizeof(packet.originalPacketLength));

            packet.packetContent.resize(packet.capturedPacketLength);

            // std::cout << std::hex << packet.packetContent.data();
            file.read(reinterpret_cast<char*>(packet.packetContent.data()), packet.capturedPacketLength);

            packets.push_back(packet);
        }
    
    file.close();
}

// parsing the packet content from Packet Record
void PcapDeserializer::getData()
{
    int counter = 1;

    FrontEndData parseFrontEnd;

    for (const auto& packet : packets)
        {
            /*
            std::cout << "Seconds: " << packet.seconds << std::endl;
            std::cout << "Microseconds: " << packet.microseconds << std::endl;
            std::cout << "Captured Packet Length: " << packet.capturedPacketLength << std::endl;
            std::cout << "Original Packet Length: " << packet.originalPacketLength << std::endl;
            std::cout << "Packet Content: ";
            */

            // front end data
            std::string destinationIP, sourceIP, protocolName, informations;

            uint32_t srcIp = (packet.packetContent[26] << 24) | (packet.packetContent[27] << 16) | (packet.packetContent[28] << 8) | packet.packetContent[29];
            uint32_t dstIp = (packet.packetContent[30] << 24) | (packet.packetContent[31] << 16) | (packet.packetContent[32] << 8) | packet.packetContent[33];

            std::ostringstream oss;
            oss << ((srcIp >> 24) & 0xff) << "." << ((srcIp >> 16) & 0xff) << "." << ((srcIp >> 8) & 0xff) << "." << (srcIp & 0xff);
            sourceIP = oss.str();

            oss.str("");

            oss <<((dstIp >> 24) & 0xff) << "." << ((dstIp >> 16) & 0xff) << "." << ((dstIp >> 8) & 0xff) << "." << (dstIp & 0xff);
            destinationIP = oss.str();

            oss.str("");

            protocolName = this->getProtocolName(packet);

            informations = this->getInfo(packet);

            parseFrontEnd.index = counter;
            parseFrontEnd.sourceIP = sourceIP;
            parseFrontEnd.destinationIP = destinationIP;
            parseFrontEnd.protocol = protocolName;
            parseFrontEnd.info = informations;
            parseFrontEnd.timeElapsed = (packet.seconds + packet.microseconds / 1000000.0) - (packets[0].seconds + packets[0].microseconds / 1000000.0);

            /*
            std::cout << "Source IP: " << sourceIP << '\n';
            std::cout << "Destination IP: " << destinationIP << '\n';
            std::cout << "Protocol: " << protocolName << '\n';
            std::cout << "Info: " << informations << '\n';
            std::cout<<'\n';
            */
            
            std::string readableString;

            for (const auto& byte : packet.packetContent)
            {
                oss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(byte) << " ";
                //oss << std::hex << static_cast<int>(byte) << " ";

                if (std::isprint(byte))
                {
                    readableString += byte;
                }
                else
                {
                    readableString += '.';
                }
            }

            std::string hexString = oss.str();

            oss.str("");

            parseFrontEnd.readableString = readableString;
            parseFrontEnd.hexValues = hexString;

           /*
                for (const auto& byte : packet.packetContent)
                    {
                        std::cout << std::hex << static_cast<int>(byte) << " ";
                    }

                std::cout << std::dec << std::endl << std::endl;
            */

            frontEndData.push_back(parseFrontEnd);

            counter++;
        }

    // getting full parsed data
    PcapData data;

    for(unsigned i=0; i<packets.size(); i++)
        {
            data.setFrontEndData(frontEndData[i]);
            data.setPacketRecord(packets[i]);

            this->parsedData.push_back(data);
        }
}

std::vector <PcapData> PcapDeserializer::getPcapInformations() const
{
    return this->parsedData;
}

void PcapDeserializer::parseFile(std::string fileName)
{
    this->readFile(fileName);

    this->getData();
}

void PcapDeserializer::liveCaptureDeserializer(std::vector<PacketRecord> capturedPackets)
{
    this->packets = capturedPackets;

    this->getData();
}

void PcapDeserializer::clearData()
{
    this->parsedData.clear();
    this->frontEndData.clear();
    this->packets.clear();
}

PcapDeserializer::PcapDeserializer()
{
    
}

PcapDeserializer::~PcapDeserializer()
{
    this->clearData();
}