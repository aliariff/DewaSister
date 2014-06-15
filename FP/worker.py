import urllib2
import json
import requests
from scipy.spatial import distance

url = "http://10.151.34.157:3000"
jumlah = "1000"
worker = "ali"
i = 1
while True:
	list_centroid = requests.get(url + "/centroid").json()
	list_dataset = requests.get(url + "/dataset?rowNumbers="+jumlah+"&workerName="+worker).json()
	list_kirim_data = []
	for dataset in list_dataset:
		if "data" in dataset:
			dist = []
			for centroid in list_centroid:
				dist.append(distance.euclidean(dataset['data'], centroid))
			minimal = min(float(s) for s in dist)
			temp = {}
			temp['id'] = dataset['_id']
			temp['result'] = dist.index(minimal)
			list_kirim_data.append(temp)

	list_kirim_data = json.dumps(list_kirim_data)
	headers = {'Content-type': 'application/json'}
	print requests.post(url + "/dataset", data='{"dataSet": '+list_kirim_data+'}', headers=headers).text
	print str(i)
	i = i+1
