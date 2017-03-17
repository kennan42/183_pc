var MEAP=require("meap");


function run(Param, Robot, Request, Response, IF)
{
	
	Response.end(JSON.stringify({
	    status:1,
	    message:'Hello World'
	}));
	
}

exports.Runner = run;


                                

	

