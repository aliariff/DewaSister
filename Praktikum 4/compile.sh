#!/bin/sh
javac HelloServer.java HelloApp/*.java -Xlint:unchecked
javac HelloClient.java HelloApp/*.java -Xlint:unchecked
