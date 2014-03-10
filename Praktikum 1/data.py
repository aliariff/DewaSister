import time
class DataRequest(self):
	def ___init__(self, action, variable):
		self.action = action
		self.variable = variable
		self.timestamp = int(time.time())

class DataResponse(self):
	def __init__(self, reqAction, reqVariable, result):
		self.reqAction = action
		self.reqVariable = variable
		self.timestamp = int(time.time())
