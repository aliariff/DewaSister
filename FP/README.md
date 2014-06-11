# Final Project Sistem Terdistribusi 2014

## Dikerjakan Oleh

* Putu Wiramaswara Widya (5111100012) <wiramaswara11@mhs.if.its.ac.id>
* Ali Ariff (5111100115) <ali11@mhs.if.its.ac.id>

## Tugas FP Secara Umum

* Melakukan proses klasifikasi data KDDCUP 1999 (http://kdd.ics.uci.edu/databases/kddcup99/)
* Langkah klasifikasi yang diberikan :
    * Lakukan proses pencarian centroid dari 10% dataset (tersedia di link) menggunakan algoritma K-Means dengan 23 klasifikasi.
    * Lakukan proses klasifikasi untuk setiap dataset penuh dengan algoritma Euclidean Distance dengan semua hasil centroid. Cari distance terkecil.
    * Dataset memiliki field simbolik yang bisa dihapus atau diubah ke dalam bentuk simbol.
* Teknik clustering bisa dilakukan dengan dua cara :
    * Membagi proses (Dispy, MPI)
    * Membagi data (Hadoop, REST, RabbitMQ)

## Pengerjaan FP Kelompok kita

### Garis besar

* FP akan dikerjakan dalam dua platform: manager dan worker.
* Manager bertugas untuk memberi tugas kepada worker, worker mengerjakan proses klasifikasi.
* Dalam hal FP ini, kami membalikkan tugas tersebut menjadi: worker meminta jobs ke manager untuk kemudian dikerjakan. Worker yang aktif pertama.
    * Hal ini untuk membuat fleksibilitas program, siapapun yang ingin join tinggal meminta jobs ke manager
* Manager memiliki konsep berikut :
    * Akses melalui HTTP berbasis REST
    * Dataset penuh dan hasil centroid disimpan di dalam basis data MongoDB.
    * Worker bisa meminta/mengirim beberapa data berikut :
        * MEMINTA Properti dataset, jumlah dataset terklasifikasi.
        * MEMINTA Data Centroid
        * MEMINTA Dataset sejumlah tertentu (setiap row diberi id tertentu).
        * MENGIRIM Hasil klasifikasi untuk dataset

## Protokol Worker

### GET /api/getProperty

* Masukkan: -
* Luaran: Properti dataset, jumlah dataset terklasifikasi dan worker yang sedang melakukan kalkulasi
* Struktur luaran :
    * dsProperty
        * totalRow
        * classificatedN
        * algorithm
    * worker[]:
        * joinTime
        * finishTime
        * ipAddress
        * workerName
        * requestedRow
        * submittedRow

### GET /api/centroid
* Masukkan: -
* Luaran: Data centroid
* Struktur luaran:
    * centroid[]

### GET /api/getDataset
* Masukkan: Jumlah row yang diminta, nama worker
* Struktur masukkan :
    * rowNumbers
    * workerName
* Proses: Catat sebagai worker[]
* Luaran: Dataset yang diminta sesuai rowNumbers
* Struktur luaran :
    * dataSet[]
        * id
        * data

### POST /api/postDataSet

* Masukkan: Hasil dataset yang diberikan
* Struktur masukkan :
    * dataSet[]
        * id
        * hasilKlasifikasi
* Luaran: Jumlah data diterima
* Struktur luaran:
    * dataSubmitResult
        * rowSubmitted
        * finishTime

### GET /api/getClassificatedData

* Masukkan: -
* Luaran: Data yang sudah terklasifikasi
* Struktur luaran:
    * classificatedData
