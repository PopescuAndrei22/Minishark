#include <node_api.h>
#include <string>
#include <vector>
#include <stdio.h>
#include <stdlib.h>
#include "../include/PcapDeserializer.h"
#include "../include/PcapData.h"
#include <pcap.h>

#define NAPI_CALL(env, call)                                      \
  do                                                              \
  {                                                               \
    napi_status status = (call);                                  \
    if (status != napi_ok)                                        \
    {                                                             \
      const napi_extended_error_info *error_info = NULL;          \
      napi_get_last_error_info((env), &error_info);               \
      bool is_pending;                                            \
      napi_is_exception_pending((env), &is_pending);              \
      if (!is_pending)                                            \
      {                                                           \
        const char *message = (error_info->error_message == NULL) \
                                  ? "empty error message"         \
                                  : error_info->error_message;    \
        napi_throw_error((env), NULL, message);                   \
        return NULL;                                              \
      }                                                           \
    }                                                             \
  } while (0)

// Function to retrieve the available networks for live capture
void getAvailableNetworks()
{
    char errbuf[PCAP_ERRBUF_SIZE];

    // Get the list of available network devices
    pcap_if_t *alldevs;
    if (pcap_findalldevs(&alldevs, errbuf) == -1)
    {
        fprintf(stderr, "Error finding devices: %s\n", errbuf);
        return;
    }

    // Iterate over the list of devices and print their names and descriptions
    pcap_if_t *device;
    for (device = alldevs; device != NULL; device = device->next)
    {
        printf("Name: %s\n", device->name);
        if (device->description)
            printf("Description: %s\n", device->description);
        else
            printf("Description: N/A\n");

        printf("\n");
    }

    // Free the list of devices
    pcap_freealldevs(alldevs);
}

napi_value Operations(napi_env env, napi_callback_info info)
{
  getAvailableNetworks();

  size_t argc = 1;
  napi_value args[1];
  std::string filePath;
  
  // Get the value of the first argument passed to the function
  NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

  // Convert the value to a C++ string
  size_t str_size;
  NAPI_CALL(env, napi_get_value_string_utf8(env, args[0], NULL, 0, &str_size));
  filePath.resize(str_size);
  NAPI_CALL(env, napi_get_value_string_utf8(env, args[0], &filePath[0], str_size + 1, NULL));

  PcapDeserializer ob(filePath);
  //PcapDeserializer ob("D:/GitHub/Minishark/Records3.pcap");

  std::vector<PcapData> pcapParsedData = ob.getPcapInformations();

  // if pcapParsedData.size == 0, use try catch to solve this
  
  std::vector<napi_value> objectValues;
  napi_value output;

  for (int i = 0; i < pcapParsedData.size(); i++)
  {
    // Frontend Data
    std::uint32_t index = pcapParsedData[i].getIndex();
    double timeElapsed = pcapParsedData[i].getTimeElapsed();
    std::string destinationIP = pcapParsedData[i].getDestinationIP();
    std::string sourceIP = pcapParsedData[i].getSourceIP();
    std::string protocol = pcapParsedData[i].getProtocol();
    std::string infoData = pcapParsedData[i].getInfo();

    std::string readableString = pcapParsedData[i].getReadableString();
    std::string hexValues = pcapParsedData[i].getHexValues();

    //Packet record

    std::uint32_t originalPacketLength = pcapParsedData[i].getOriginalPacketLength();

    napi_value obj;
    napi_create_object(env, &obj);

    //NAPI variables for frontend data

    napi_value napiDestinationIP, napiSourceIP, napiProtocol, napiInfoData, napiIndex, napiTimeElapsed, napiHexValues, napiReadableString;

    //NAPI variables for packet record

    napi_value napiOriginalPacketLength;

    //NAPI for packet record
    NAPI_CALL(env, napi_create_uint32(env, originalPacketLength, &napiOriginalPacketLength));

    NAPI_CALL(env, napi_set_named_property(env, obj, "originalPacketLength", napiOriginalPacketLength));

    // NAPI for frontend data
    NAPI_CALL(env, napi_create_uint32(env, index, &napiIndex));
    NAPI_CALL(env, napi_create_double(env, timeElapsed, &napiTimeElapsed));
    NAPI_CALL(env, napi_create_string_utf8(env, destinationIP.c_str(), destinationIP.length(), &napiDestinationIP));
    NAPI_CALL(env, napi_create_string_utf8(env, sourceIP.c_str(), sourceIP.length(), &napiSourceIP));
    NAPI_CALL(env, napi_create_string_utf8(env, protocol.c_str(), protocol.length(), &napiProtocol));
    NAPI_CALL(env, napi_create_string_utf8(env, infoData.c_str(), infoData.length(), &napiInfoData));
    NAPI_CALL(env, napi_create_string_utf8(env, hexValues.c_str(), hexValues.length(), &napiHexValues));
    NAPI_CALL(env, napi_create_string_utf8(env, readableString.c_str(), readableString.length(), &napiReadableString));

    NAPI_CALL(env, napi_set_named_property(env, obj, "index", napiIndex));
    NAPI_CALL(env, napi_set_named_property(env, obj, "timeElapsed", napiTimeElapsed));
    NAPI_CALL(env, napi_set_named_property(env, obj, "destinationIP", napiDestinationIP));
    NAPI_CALL(env, napi_set_named_property(env, obj, "sourceIP", napiSourceIP));
    NAPI_CALL(env, napi_set_named_property(env, obj, "protocol", napiProtocol));
    NAPI_CALL(env, napi_set_named_property(env, obj, "infoData", napiInfoData));
    NAPI_CALL(env, napi_set_named_property(env, obj, "hexValues", napiHexValues));
    NAPI_CALL(env, napi_set_named_property(env, obj, "readableString", napiReadableString));

    objectValues.push_back(obj);
  }

  NAPI_CALL(env, napi_create_array_with_length(env, objectValues.size(), &output));

  for (size_t i = 0; i < objectValues.size(); i++)
  {
    NAPI_CALL(env, napi_set_element(env, output, i, objectValues[i]));
  }

  return output;
}

napi_value init(napi_env env, napi_value exports)
{
  napi_value operations;

  napi_create_function(env, nullptr, 0, Operations, nullptr, &operations);

  return operations;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init);