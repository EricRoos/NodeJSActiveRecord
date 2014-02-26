var records = require("./database_conn");
var config = require("./config");
records.connect(config.conn_info);

var print_rows = function(rows){
  console.log(rows);
};
records.find("grocery",1,['*'],print_rows);
records.all("grocery",['name'],print_rows);
records.oneToMany("user","posts",1,print_rows);
records.hasOne("user","grocery_list",1,print_rows);
records.close();

