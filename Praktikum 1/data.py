import time
class DataRequest:
	def __init__(self, action, variable):
		self.action = action
		self.variable = variable
		self.timestamp = int(time.time())

class DataResponse:
	def __init__(self, reqAction, reqVariable, result):
		self.reqAction = reqAction
		self.reqVariable = reqVariable
		self.result = result
		self.timestamp = int(time.time())
