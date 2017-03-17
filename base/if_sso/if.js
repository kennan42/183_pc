var MEAP = require("meap");

function run(Param, Robot, Request, Response, IF){
	
	var username=Param.params.username;
	var token=Param.params.token;
	var redir = Param.params.redir;
	var module = Param.params.module;
	var option={
		url:global.ntlm_url,
		Headers:{"Cookie":"JSESSIONID=" + token}
	};
	
	MEAP.AJAX.Runner(option,function(err,res,data){
		if(!err && res.statusCode == 200)
		{
				var uuid = Robot.createSession(Response, true, 300 * 60);
		        Robot.Set("username",  username);
			   	var cookies = Response.getHeader("Set-Cookie") || [];
				cookies.push("x-mas-app-info=" + Param.appid + "/" + uuid + "; path=/");
				cookies.push("userid=" + username + ";path=/");
				Response.setHeader("Set-Cookie", cookies);
				if(module === "meet"){
				    Response.setHeader("Location", "/roomMeeting/MeetingReservation/" + redir);
				}else{
				    Response.setHeader("Location", "/web/" + redir);
				}
		        Response.statusCode = 302;
		        Response.end();  
		}
		else
		{
			Response.setHeader("Location", "/web/login.html#error=Login Fail");
		    Response.statusCode = 302;
			Response.end();
		}
	});
    
}

exports.Runner = run;




