cmake_minimum_required(VERSION 3.15)
cmake_policy(SET CMP0091 NEW)
cmake_policy(SET CMP0042 NEW)

project(operations)

add_definitions(-DNAPI_VERSION=4)

include_directories(${CMAKE_JS_INC})

# Add the directory containing your class headers
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
>>>>>>> Stashed changes
include_directories("D:/GitHub/Minishark/include")
include_directories("D:/GitHub/Minishark/NAPI/npcap/Include")

# Add the directory containing the Npcap library files
link_directories("D:/GitHub/Minishark/NAPI/npcap/Lib/x64")
=======
include_directories("C:/Users/Alex/Desktop/Minishark/include")
include_directories("C:/Users/Alex/Desktop/Minishark/NAPI/npcap/Include")
>>>>>>> beb56a55f6282374a01e3177ecab618d9370d552

# Add the directory containing the Npcap library files
<<<<<<< Updated upstream
=======
=======
include_directories("C:/Users/Alex/Desktop/Minishark/include")
include_directories("C:/Users/Alex/Desktop/Minishark/NAPI/npcap/Include")

# Add the directory containing the Npcap library files
>>>>>>> beb56a55f6282374a01e3177ecab618d9370d552
>>>>>>> Stashed changes
link_directories("C:/Users/Alex/Desktop/Minishark/NAPI/npcap/Lib/x64")

file(GLOB SOURCE_FILES "C:/Users/Alex/Desktop/Minishark/NAPI/operations.cc")

# Add the source files for your classes
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
>>>>>>> Stashed changes
list(APPEND SOURCE_FILES "D:/GitHub/Minishark/implementations/PcapData.cpp")
list(APPEND SOURCE_FILES "D:/GitHub/Minishark/implementations/PcapDeserializer.cpp")
list(APPEND SOURCE_FILES "D:/GitHub/Minishark/implementations/LiveCapture.cpp")
=======
list(APPEND SOURCE_FILES "C:/Users/Alex/Desktop/Minishark/implementations/PcapData.cpp")
list(APPEND SOURCE_FILES "C:/Users/Alex/Desktop/Minishark/implementations/PcapDeserializer.cpp")
>>>>>>> beb56a55f6282374a01e3177ecab618d9370d552
<<<<<<< Updated upstream
=======
=======
list(APPEND SOURCE_FILES "C:/Users/Alex/Desktop/Minishark/implementations/PcapData.cpp")
list(APPEND SOURCE_FILES "C:/Users/Alex/Desktop/Minishark/implementations/PcapDeserializer.cpp")
>>>>>>> beb56a55f6282374a01e3177ecab618d9370d552
>>>>>>> Stashed changes

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} wpcap.lib Packet.lib)

if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
  # Generate node.lib
  execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
endif()