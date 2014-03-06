var records = require("./database_conn");
var config = require("./config");
records.connect(config.conn_info);

var http = require("http");
var express = require('express');
var app = express();
var crypto = require('crypto');
app.use(express.bodyParser());

var user_keys = new Array();
user_keys[1] = "abcdefg";

//////////////// HELPER FUNCTIONS ////////////////////
function stringifyRows(res,rows){
  sendPacket(res,JSON.stringify(rows).replace("/},/g",",\r\n"));
}

function formatToDos(rows){
  var reply = "";
  for(key in rows){
    var row = rows[key];
    reply += row.id;
    reply += "\t";
    reply += row.content;
    reply += "\r\n";
  }
  reply+= "\r\n";
  return reply;
}
function ack(res){
  sendPacket(res,"ok");
}
function sendPacket(res,pkg){
  res.setHeader('Content-Type','text/plain');
  res.end(pkg+"\r\n");
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

function verify_request(data,theirSignature,user_id){
  var computed_signature = crypto.createHmac('sha1',user_keys[user_id]).update(data).digest('base64');
  console.log(computed_signature);
  return theirSignature == computed_signature;
}

verify_request("abcdefg","howdy",1);
///////////////// START THE SERVER CODE ////////////////////
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
    sendPacket(res,formatToDos(rows));
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
  console.log(req.body);
  var keys = get_keys(req.body);
  var values = get_values(keys,req.body);
  records.insert("ToDo",keys,values,function(rows){
    ack(res);
  });
});

app.listen(3000);

