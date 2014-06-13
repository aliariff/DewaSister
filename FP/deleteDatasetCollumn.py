import csv

with open('./kddcup.newtestdata_10_percent_unlabeled') as fr:
#with open('./kddcup.data.corrected') as fr:
    reader = csv.reader(fr)
    with open('./kddcup.newtestdata_10_percent_unlabeled.delcol', 'w') as fw:
    #with open('./kddcup.data.corrected.delcol', 'w') as fw:
        writer = csv.writer(fw)
        for row in reader:
            #del row[41] # Labeled dataset only
            del row[1]
            del row[1]
            del row[1]
            writer.writerow(row)






