var records = require("./database_conn");
var config = require("./config");
records.connect(config.conn_info);

var http = require("http");
var express = require('express')
var app = express();
app.use(express.bodyParser());
function stringifyRows(res,rows){
  res.setHeader('Content-Type','text/plain');
  res.end(JSON.stringify(rows).replace("/},/g",",\n")+"\r\n");
}
function ack(res){
  res.setHeader('Content-Type','text/plain');
  res.end("ok\r\n");
}
function get_keys(hash){
  retkeys = new Array();
  var keys = Object.keys(hash);
  for(key in keys){
    retkeys.push(keys[key]);
  }
  return retkeys;
}
function get_values(keys,hash){
  retvals = new Array();
  for(key in keys){
    retvals.push(hash[keys[key]]);
  }
  return retvals;
}
app.get("/users/:id",function(req,res){
  var id = req.param('id');
  console.log("GET /users/"+id)
  records.find("user",id,["*"],function(rows){
    stringifyRows(res,rows);
  });
});

app.get("/users/:id/todos",function(req,res){
  var id = req.param('id');
  console.log("GET /users/"+id+"/todos")
  records.oneToMany("user","ToDo",id,function(rows){
    stringifyRows(res,rows);
  });
});

app.delete("/todos/:id/delete",function(req,res){
  var id = req.param('id');
  console.log("DELETE /todos/"+id+"/delete")
  records.delete("ToDo",id,function(rows){
    ack(res);
  });
});

app.post("/todos",function(req,res){
  console.log("POST /todos");
  var keys = get_keys(req.body);
  var values = get_values(keys,req.body);
  console.log(keys);
  console.log(values);
  records.insert("ToDo",keys,values,function(rows){
    stringifyRows(res,rows);
  });
});
app.listen(3000);

