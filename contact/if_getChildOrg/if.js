var MEAP=require("meap");
var mongoose = require("mongoose");
var async = require("async");
var redis = require("meap_redis");
var contactSchema = require("../Contact.js");
var contactUtil = require("../util.js");
var util = require("../../base/util.js");

/**
 * 查询某部门的下级部门，如果不传递，则查询顶级部门
 * @author
 * @date 2015年9月1日 19:02
 * */
function run(Param, Robot, Request, Response, IF)
{
    Response.setHeader("Content-Type","text/json;charset=utf8");
	var arg = JSON.parse(Param.body.toString());
	var orgId = arg.orgId;
	var hashStr = "getChildOrg~" + orgId;
	var conn = mongoose.createConnection(global.mongodbURL);
	var orgModel = conn.model("base_org",contactSchema.BaseOrgSchema);
	var orgLevelModel = conn.model("base_org_level",contactSchema.BaseOrgLevelSchema);
	var orgIds = [];
	var topOrgIds = null;//顶级部门id
	var result = null;//接口返回最终结果
	async.series([
		//从redis缓存里进行查询
		function(cb){
			var redisCli = redis.createClient(global.redisPort,global.redisHost);
			redisCli.on("ready",function(){
				redisCli.select(contactUtil.contactConst.redisDB,function(){
					redisCli.get(hashStr,function(err,data){
						redisCli.quit();
						if(data != null){
							console.log("get data from redis");
							Response.end(JSON.stringify({
								"status":"0",
								"data":JSON.parse(data)
							}));
							conn.close();
							addOpLog(arg);
						}else{
							cb(null,"");
						}
					});
				});
			});
		},
		//查询顶级部门id
		function(cb){
			if(arg.orgId == ""){
				var userModel = conn.model("base_user",contactSchema.BaseUserSchema);
				userModel.distinct("ZZ_GS",function(err,data){
					if(err){
						console.log("查询顶级部门id失败");
					}
					topOrgIds = data;
					cb(err,"");
				});
			}else{
				cb(null,"");
			}
		},
		//查询部门
		function(cb){
			console.log("get org data");
			var condition = {};
			var sort =  {"ZZ_SUB_OBJ":1};
			if(arg.orgId == ""){//默认查询3个顶级部门
				condition = {"ZZ_OBJ":"00000001","ZZ_OBJ_LEVEL":"2","ZZ_SUB_OBJ":{
					"$in":topOrgIds
				}};
			}else{
				condition = {"ZZ_OBJ":arg.orgId};
			}
			orgModel.find(condition)
					.sort(sort)
					.exec(function(err,data){
						if(err){
							console.log(err,"查询部门信息失败");
						}
						orgIds = getOrgIds(data);
						cb(err,data);
			});
		},
		//查询部门级别
		function(cb){
			console.log("get orgLevel data");
			orgLevelModel.find({"OBJID":{"$in":orgIds}},function(err,data){
				if(err){
					console.log(err,"查询部门级别失败");
				}
				cb(err,data);
			});
		}
	],function(err,data){
		conn.close();
		if(err){
			Response.end(JSON.stringify({
				"status":"-1",
				"msg":"查询组织机构信息失败"
			}));
		}else{
			var orgs = data[2];
			var orgLevels = data[3];
			var orgWithLevels = getOrgWithLevel(orgs,orgLevels);
			Response.end(JSON.stringify({
				"status":"0",
				"data":orgWithLevels
			}));
			//将结果缓存到redis
			result = JSON.stringify(orgWithLevels);
			var redisCli = redis.createClient(global.redisPort,global.redisHost);
			redisCli.on("ready",function(){
				redisCli.select(contactUtil.contactConst.redisDB,function(){
					redisCli.setex(hashStr,contactUtil.contactConst.ttl,result,function(err){
						redisCli.quit();
						console.log("save cache to redis");
					});
				});
			});
			addOpLog(arg);
		}
	});
	
	
}

function getOrgIds(orgs){
	var rs = [];
	for(var i in orgs){
			rs.push(orgs[i].ZZ_SUB_OBJ);
	}
	return rs;
}

function getOrgWithLevel(orgs,orgLevels){
	var rs = [];
	for(var i in orgs){
		var org = orgs[i];
		var jgcj = "";//层级
		var orgId = org.ZZ_SUB_OBJ;
		for(var j in orgLevels){
			if(orgId ==  orgLevels[j].OBJID){
				jgcj = orgLevels[j].ZZ_JGCJ;
				rs.push({"orgId":org.ZZ_SUB_OBJ,"orgName":org.ZZ_SUB_OBJT,"orgLevel":jgcj,
					"orgFZR":org.ZZ_BMFZR,"orgFRZName":org.ZZ_BMFZR_XM});
				break;
			}
		}
	}
	return rs;
}

//记录操作类型
function addOpLog(arg){
	if(arg.orgId != ""){
		var orgId = arg.orgId;
		var userId = arg.userId;
		var conn =  mongoose.createConnection(global.mongodbURL);
		var actionAnalyModel = conn.model("contact_action_log",contactSchema.ContactActionLogSchema);
		var orgModel = conn.model("base_org",contactSchema.BaseOrgSchema);
		orgModel.findOne({"ZZ_OBJ":orgId},function(err,data){
			if(!err && data != null){
				var orgName = data.ZZ_OBJT;
				var actionAnaly = new actionAnalyModel({
					"userId":userId,
					"argId":orgId,
					"argName":orgName,
					"opType":"queryOrg",
					"opTime":new Date().getTime()
				});
				actionAnaly.save(function(err){
					conn.close();
					console.log("add queryOrg about org log over");
				});
			}else{
				conn.close();
				console.log("query org error",err);
			}
		});	
	}
	
}

exports.Runner = run;


                                

	

