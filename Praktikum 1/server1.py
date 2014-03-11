# import required module
import socket, select, sys, json, time, string, datetime
from data import DataRequest, DataResponse
from datetime import date

def unix_time(dt):
    epoch = datetime.datetime.utcfromtimestamp(0)
    delta = dt - epoch
    return delta.total_seconds()

def unix_time_millis(dt):
    return unix_time(dt) * 1000.0

# creating socket server object, bind, and listen
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind(('localhost', 5000))
server_socket.listen(5)

# list to store accepted client
input_list = [server_socket]

# open file 
list_bulan = ['Januari', 'Februari', 'Maret', 'April',
		'Mei', 'Juni', 'Juli', 'Agustus', 'September',
		'Oktober', 'November', 'Desember']
f = open('data.txt', 'r')
lines = {}
for line in f:
	temp = string.split(line, ' - ')
	temp[0] = string.split(temp[0], ', ')[1]
	temp[1] = temp[1][:-1]
	lines[temp[0]] = temp[1]
f.close()
print lines
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
					
					if (json_data['action'] == 'requestWeatherDateSpecific'):
						tgl = time.strftime('%d', time.localtime(float(json_data['variable'][0])))
						bulan = int(time.strftime('%m', time.localtime(float(json_data['variable'][0]))))
						tahun = time.strftime('%Y', time.localtime(float(json_data['variable'][0])))
						bulan = list_bulan[bulan-1]
						waktu = tgl + ' ' + bulan + ' ' + tahun
						
						try:
							result.append({json_data['variable'][0]: lines[waktu]})
						except:
							result = []
					elif (json_data['action'] == 'requestWeatherDateRange'):
						tgl_awal = time.strftime('%d', time.localtime(float(json_data['variable'][0])))
						bulan_awal = int(time.strftime('%m', time.localtime(float(json_data['variable'][0]))))
						tahun_awal = time.strftime('%Y', time.localtime(float(json_data['variable'][0])))
						d0 = date(int(tahun_awal), int(bulan_awal), int(tgl_awal))
						bulan_awal = list_bulan[bulan_awal-1]
						waktu_awal = tgl_awal + ' ' + bulan_awal + ' ' + tahun_awal
						
						tgl_akhir = time.strftime('%d', time.localtime(float(json_data['variable'][1])))
						bulan_akhir = int(time.strftime('%m', time.localtime(float(json_data['variable'][1]))))
						tahun_akhir = time.strftime('%Y', time.localtime(float(json_data['variable'][1])))
						d1 = date(int(tahun_akhir), int(bulan_akhir), int(tgl_akhir))
						bulan_akhir = list_bulan[bulan_akhir-1]
						waktu_akhir = tgl_akhir + ' ' + bulan_akhir + ' ' + tahun_akhir
						
						delta = d1 - d0
						try:
							for x in range(0, delta.days + 1):
								tgl = d0.strftime('%d')
								bulan = int(d0.strftime('%m'))
								tahun = d0.strftime('%Y')
								dt = datetime.datetime(int(tahun), int(bulan), int(tgl), 0, 0)
								epo = unix_time(dt)
								bulan = list_bulan[bulan-1]
								waktu = tgl + ' ' + bulan + ' ' + tahun
								result.append({int(epo): lines[waktu]})
								d0 = d0 + datetime.timedelta(days=1)
						except:
							raise
							result = []
					elif (json_data['action'] == 'requestWeatherAll'):
						tgl_awal = time.strftime('%d', time.localtime(float(json_data['variable'][0])))
						bulan_awal = int(time.strftime('%m', time.localtime(float(json_data['variable'][0]))))
						tahun_awal = time.strftime('%Y', time.localtime(float(json_data['variable'][0])))
						d0 = date(int(tahun_awal), int(bulan_awal), int(tgl_awal))
						bulan_awal = list_bulan[bulan_awal-1]
						waktu_awal = tgl_awal + ' ' + bulan_awal + ' ' + tahun_awal
						
						tgl_akhir = time.strftime('%d', time.localtime(float(json_data['variable'][1])))
						bulan_akhir = int(time.strftime('%m', time.localtime(float(json_data['variable'][1]))))
						tahun_akhir = time.strftime('%Y', time.localtime(float(json_data['variable'][1])))
						d1 = date(int(tahun_akhir), int(bulan_akhir), int(tgl_akhir))
						bulan_akhir = list_bulan[bulan_akhir-1]
						waktu_akhir = tgl_akhir + ' ' + bulan_akhir + ' ' + tahun_akhir
						
						delta = d1 - d0
						try:
							for x in range(0, delta.days + 1):
								tgl = d0.strftime('%d')
								bulan = int(d0.strftime('%m'))
								tahun = d0.strftime('%Y')
								dt = datetime.datetime(int(tahun), int(bulan), int(tgl), 0, 0)
								epo = unix_time(dt)
								bulan = list_bulan[bulan-1]
								waktu = tgl + ' ' + bulan + ' ' + tahun
								result.append({int(epo): lines[waktu]})
								d0 = d0 + datetime.timedelta(days=1)
						except:
							raise
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
