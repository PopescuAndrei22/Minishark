#include <node_api.h>
#include <string>
#include <vector>
#include <stdio.h>
#include <stdlib.h>
#include "../include/PcapDeserializer.h"
#include "../include/PcapData.h"

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

std::vector<std::string> getStrings() {
  std::vector<std::string> strings;
  strings.push_back("string 1");
  strings.push_back("string 2");
  strings.push_back("string 3");
  return strings;
}

napi_value Operations(napi_env env, napi_callback_info info)
{
  PcapDeserializer ob("D:/GitHub/Minishark/Records3.pcap");

  std::vector <PcapData> pcapParsedData = ob.getPcapInformations();

  // if pcapParsedData.size == 0, use try catch to solve this

  size_t argc = 0;
  std::vector<std::string> strings = getStrings();
  std::vector<napi_value> objectValues;
  napi_value output;

  std::uint32_t index = pcapParsedData[0].getIndex();
  std::string destinationIP = pcapParsedData[0].getDestinationIP();
  std::string sourceIP = pcapParsedData[0].getSourceIP();
  std::string protocol = pcapParsedData[0].getProtocol();
  std::string infoData = pcapParsedData[0].getInfo();

  napi_value obj;
  napi_create_object(env,&obj);

  napi_value napiDestinationIP,napiSourceIP,napiProtocol,napiInfoData,napiIndex;

  NAPI_CALL(env,napi_create_string_utf8(env, destinationIP.c_str(), destinationIP.length(), &napiDestinationIP));
  NAPI_CALL(env,napi_create_string_utf8(env, sourceIP.c_str(), sourceIP.length(), &napiSourceIP));
  NAPI_CALL(env,napi_create_string_utf8(env, protocol.c_str(), protocol.length(), &napiProtocol));
  NAPI_CALL(env,napi_create_string_utf8(env, infoData.c_str(), infoData.length(), &napiInfoData));

  NAPI_CALL(env, napi_set_named_property(env, obj, "destinationIP", napiDestinationIP));
  NAPI_CALL(env, napi_set_named_property(env, obj, "sourceIP", napiSourceIP));
  NAPI_CALL(env, napi_set_named_property(env, obj, "protocol", napiProtocol));
  NAPI_CALL(env, napi_set_named_property(env, obj, "infoData", napiInfoData));

  objectValues.push_back(obj);

  NAPI_CALL(env,napi_create_array_with_length(env, objectValues.size(), &output));

  for (size_t i = 0; i < objectValues.size(); i++) {
    NAPI_CALL(env,napi_set_element(env, output, i, objectValues[i]));
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