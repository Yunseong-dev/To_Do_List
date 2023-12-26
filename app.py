from flask import Flask, request

app = Flask(__name__)

to_do_list = []

@app.route('/api/todo', methods = ['GET', 'POST', 'DELETE'])
def todo():
   if request.method == 'GET':
      return to_do_list
   if request.method == 'POST':
      data = request.get_json()
      to_do_list.append(data)
      print('todo appended: ', to_do_list)
      return "200"

@app.route('/test')
def test():
   return 'OK'