from pymongo import MongoClient

client = MongoClient()
db = client.fpsister

dapatData = []

# Ganti nama file dengan data 10% nya contoh jika tidak ingin leletletletletletlettelgatel
for line in open('./kddcup.data.corrected'):
    hasil = line.strip().split(',')
    if len(dapatData)==100000:
        db.dataset.insert(dapatData)
        dapatData = []
    else:
        dapatData.append({'data': hasil})

