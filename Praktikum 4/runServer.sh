#!/bin/sh

orbd -ORBInitialPort 1050 -ORBInitialHost localhost&

java HelloServer -ORBInitialPort 1050 -ORBInitialHost localhost
