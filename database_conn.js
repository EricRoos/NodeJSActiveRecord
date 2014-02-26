var mysql = require('mysql');
var connection = null;
function invoke_query(sql,callback){
  connection.query(sql,function(err,rows){
    if(err){
      throw err;
    }else{
      callback(rows);
    }
 });
}

module.exports = {
  connect: function(params){
    connection = mysql.createConnection(params);
    connection.connect()
  },
  find: function(tbl_name,id,cols,callback){
    var sql = "SELECT " + cols + " FROM " + tbl_name + " ";
    sql += "WHERE id = " + id;
    invoke_query(sql,callback)
  },

  oneToMany: function(theOne,theMany,id,callback){
    var sql = "SELECT "+theMany+".* FROM " + theMany + " ";
    sql +=  "JOIN "+theOne + " ON " + theOne+".id = " + theMany + "."+theOne+"_id ";
    sql += "WHERE " + theOne + ".id = " + id;
    invoke_query(sql,callback);
  },

  hasOne: function(owner, entity,id,callback){
    var sql = "SELECT "+entity+".* FROM " + entity;
    sql += " JOIN "+owner + " ON " + owner+".id = " + entity + "."+owner+"_id";
    sql +=" WHERE " + owner + ".id = " + id;
    sql += " LIMIT 1";
    invoke_query(sql,function(rows){
      callback(rows[0]);
    });
  },

  query: function(sql,callback){
    invoke_query(sql,callback);
  },

  all: function(tbl_name,cols,callback){
    var sql = "SELECT " + cols + " FROM " + tbl_name;
    invoke_query(sql,callback);
  },
  close: function(){
    connection.end();
  }
};



