#include <node_api.h>
#include <string>
#include <vector>
#include <stdio.h>
#include <stdlib.h>
#include <../include/PcapDeserializer.h>
#include <../include/PcapData.h>

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
  /*
  PcapDeserializer ob("D:/GitHub/Minishark/Records3.pcap");

  std::vector <PcapData> pcapParsedData = ob.getPcapInformations();

  std::cout<<pcapParsedData.size()<<'\n';
  */
  size_t argc = 0;
  std::vector<std::string> strings = getStrings();
  std::vector<napi_value> objectValues;
  napi_value output;

  for (const auto& str : strings) {
    napi_value obj;
    napi_create_object(env, &obj);

    napi_value stringValue;
    NAPI_CALL(env,napi_create_string_utf8(env, str.c_str(), str.length(), &stringValue));

    NAPI_CALL(env, napi_set_named_property(env, obj, "value2", stringValue));

    objectValues.push_back(obj);
  }

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