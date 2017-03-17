var mongoose = require("mongoose");
var contactSchema = require("../Contact.js");

function run(Param, Robot, Request, Response, IF) {
    var conn = mongoose.createConnection(global.mongodbURL);
    var orgLevelModel = conn.model("base_org_level",contactSchema.BaseOrgLevelSchema);
    orgLevelModel.findOne({},function(err,data){
        conn.close();
       var copy =  data.toJSON();
       copy.other = "sfsadf";
       console.log(copy);
        Response.end("/contact/test");        
    });
}

exports.Runner = run;

