# import socket module
import socket, json, sys
from data import DataRequest, DataResponse

# creating socket client
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
 
# connect to server in defined address and port
client_socket.connect(('localhost', 5000))
 
# send message to server
req = DataRequest('requestWeatherDateSpecific', ['1394623007'])
#req = DataRequest('requestWeatherDateRange', ['1394536607', '1394709407'])
#req = DataRequest('requestWeatherAll', ['1394536607', '1394882207'])

client_socket.send(json.dumps(req.__dict__))

# receive message from server, 1024 is buffer size in bytes
message = client_socket.recv(1024)
 
# print message
print "From server: " + message
 
# close socket client
client_socket.close()