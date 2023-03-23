#include <node_api.h>
#include <string>
#include <vector>
#include <stdio.h>
#include <stdlib.h>


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


using Seconds = std::uint32_t;
using Microseconds = std::uint32_t;

struct PacketRecord {
    Seconds seconds;
    Microseconds microseconds;
    uint32_t capturedPacketLength;
    uint32_t originalPacketLength;
    std::vector<uint8_t> packetContent;
};

int sum(int x, int y) {
  return x + y;
}


napi_value Operations(napi_env env, napi_callback_info info)
{
  size_t argc = 2;
  napi_value args[2];
  int64_t x;
  int64_t y;
  int64_t suma;
  std::string s;
  napi_value output;

  NAPI_CALL(env,napi_get_cb_info(env, info, &argc, args, NULL, NULL));

  NAPI_CALL(env,napi_get_value_int64(env, args[0], &x));

  NAPI_CALL(env,napi_get_value_int64(env, args[1], &y));

  suma = sum(x, y);

  NAPI_CALL(env,napi_create_double(env, suma, &output));

  return output;
}

napi_value init(napi_env env, napi_value exports)
{
  napi_value operations;

  napi_create_function(env, nullptr, 0, Operations, nullptr, &operations);

  return operations;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init);