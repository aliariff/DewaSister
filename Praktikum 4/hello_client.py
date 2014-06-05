#!/usr/bin/env python
import sys

from omniORB import CORBA
import HelloApp

orb = CORBA.ORB_init(sys.argv, CORBA.ORB_ID)

obj = orb.string_to_object('corbaname::localhost:1050#Hello')

helloImpl = obj._narrow(HelloApp.Hello)
print helloImpl.sayHello()
