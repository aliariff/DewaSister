# import required module
import socket, select, sys, json, time, string
from data import DataRequest, DataResponse

# creating socket server object, bind, and listen
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind(('localhost', 5000))
server_socket.listen(5)

# list to store accepted client
input_list = [server_socket]

# open file 
f = open('data.txt', 'r')
lines = []
for line in f:
	lines.append(string.split(line, ' - ')[1][:-1])
f.close()

try:
	while 1:
		# serving multiple client alternately; one socket in a time
		input, output, exception = select.select(input_list, [], [])
		
		for socket in input:
	               # accept client and add it to list input
			if socket == server_socket:
				client_socket, client_address = server_socket.accept()
				input_list.append(client_socket)
				print "Accepted client: ", client_address
            
                       # handle sending and receiving message
			else:
				message = socket.recv(1024)
				print message
				if message:
					json_data = json.loads(message)
					result = []
					dr = DataResponse(json_data['action'], json_data['variable'], [])
					print json_data['variable'][0]
					if (json_data['action'] == 'requestWeatherDateSpecific'):
						waktu = int(time.strftime('%d', time.localtime(float(json_data['variable'][0]))))
						try:
							result.append(lines[waktu-11])
						except:
							result = []
					elif (json_data['action'] == 'requestWeatherDateRange'):
						waktu_awal = int(time.strftime('%d', time.localtime(float(json_data['variable'][0]))))
						waktu_akhir = int(time.strftime('%d', time.localtime(float(json_data['variable'][1]))))
						try:
							for x in range(waktu_awal-11, waktu_akhir-10):
								result.append(lines[x])
						except:
							result = []
					elif (json_data['action'] == 'requestWeatherAll'):
						waktu_awal = int(time.strftime('%d', time.localtime(float(json_data['variable'][0]))))
						waktu_akhir = int(time.strftime('%d', time.localtime(float(json_data['variable'][1]))))
						try:
							for x in range(waktu_awal-11, waktu_akhir-10):
								result.append(lines[x])
						except:
							result = []
					dr.result = result
					socket.send(json.dumps(dr.__dict__))
					print "Send to client : ", client_address
				else:
					socket.close()
					input_list.remove(socket)
					
# when user press CTRL + C (in Linux), close socket server and exit
except KeyboardInterrupt:
	server_socket.close()
	sys.exit(0)
except:
	print "Unexpected error:", sys.exc_info()[0]
	raise
