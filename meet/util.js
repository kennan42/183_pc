var MEAP = require("meap");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var sm=require("./meetSchema.js");


var util={
    overDate:function(arg){
        var db=mongoose.createConnection(global.mongodbURL);
        var MeetBookModel=db.model("meetBook",sm.MeetBookSchema);
        MeetBookModel.update({_id:arg.arg},{state:5},function(err,data){
             db.close();
        });
    }
}

exports.overDate=util.overDate;
