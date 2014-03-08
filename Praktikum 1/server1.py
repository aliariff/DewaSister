# import required module
import socket
import select
import sys
import json

# creating socket server object, bind, and listen
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind(('localhost', 5000))
server_socket.listen(5)

# list to store accepted client
input_list = [server_socket]

# open file 
f = open('data.txt', 'r')
lines = [line[:-1] for line in f]
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
				if message:
					reply = ""
					json_data = json.loads(message)
					if (json_data['kode'] == 'all'):
						reply = json.dumps(lines)
					else:
						try:
							reply = json.dumps(lines[int(json_data['kode'])])
						except:
							reply = "Data Tidak Ditemukan"
					socket.send(reply)
					print "Send to client : ", client_address, reply
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