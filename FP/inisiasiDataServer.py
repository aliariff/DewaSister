from pymongo import MongoClient
import numpy
from scipy.cluster.vq import kmeans


client = MongoClient()
## PROSES DATASET
def prosesDataset():
    db = client.fpsister

    dapatData = []
    #for line in open('./kddcup.data.corrected.delcol'):
    for line in open('./kddcup.newtestdata_10_percent_unlabeled.delcol'):
        hasil = line.strip().split(',')
        if len(dapatData)==100000:
            db.dataset.insert(dapatData)
            dapatData = []
        else:
            dapatData.append({'data': hasil})

    db.dataset.create_index('occupiedBy')
    db.dataset.create_index('data')

## PROSES CENTROID
def prosesCentroid():
    db = client.fpsister
    data = []
    for line in open('./kddcup.newtestdata_10_percent_unlabeled.delcol'):
        # Read whole data
        row = line.strip().split(',')
        row = map(float, row)
        data.append(row)

    centroid,label = kmeans(numpy.array(data), 23)
    for row in centroid:
        print row
        db.centroid.insert({'data': map(str, row)})


#prosesDataset()
prosesCentroid()
