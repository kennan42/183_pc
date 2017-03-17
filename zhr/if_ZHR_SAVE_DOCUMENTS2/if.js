	var MEAP = require("meap");
	var fs = require("fs");
	var path = require("path");
	var cp = require("child_process");
	var docType = '[".zip",".7z",".rar"]';
	var count = 0;
	function run(Param, Robot, Request, Response, IF){
		try {
			console.log("saveDocument2 come in");
			var filepath = Param.files.file.path;
			var filename =  Param.files.file.name;
			var filesize =  Param.files.file.size;
			var ext = path.extname(Param.files.file.name);
			if(docType.indexOf('"'+path.extname(filename).toLowerCase()+'"') > 0){
		        Response.setHeader("Content-Type", "text/plain; charset=utf-8");
		        data = JSON.stringify({RETURN_SUBRC:-1,RETURN_MESSAGE:"该文件类型不支持图片浏览"});
		        Response.end(data);
		        return;
  		 	}
			uploadFile(Response,filepath,filename,filesize);
			fs.renameSync(filepath,filepath+ext);
			var fileid = filepath.substring(filepath.lastIndexOf("/") + 1);
			var pdfname = filepath+".pdf";
			var srcname = filepath+ext;
			
			console.log("fileid-->" + fileid);
			console.log("pdfname-->" + pdfname);
			console.log("srcname-->" + srcname);
			
			convertFile(srcname,pdfname,fileid,function(err,res,destdir){
				if(!err)
					count = parseInt(res.pagecount);
					console.log("count-->" + count);
					for(var i=1;i<=count;i++){
						var imgName = "";
						if(i<10){
							imgName = "p" + "00" + i + ".jpg"
						}else if(i<100){
							imgName = "p" + "0" + i + ".jpg";
						}else{
							imgName = "p" + i + ".jpg";
						}
						console.log("imgName-->" + imgName);
						console.log("destdir-->" + destdir);
						fs.stat(destdir + "/" + imgName,function(err,fsstat){
							if(!err){
								console.log("size-->" + fsstat.size);
								uploadFile(Response,destdir + "/" + imgName,imgName,fsstat.size);
							}else{
								console.log("read file baseinfo error...");
							}
						});
						
					}
					
                                           cp.exec("rm -rf " + destdir,function(err, stdout, stderr){});
			});
		}
		catch(e)
		{
			Response.statusCode = 404;
			Response.end(JSON.stringify({
						RETURN_MESSAGE: "文件上传失败",
						RETURN_SUBRC: 1
					}));
		}
	}

	function uploadFile(Response,filepath,filename,filesize){
			fs.readFile(filepath, function(err, data){
				if (!err) {
					var doc = data.toString("base64");
					var option = {
						//wsdl:global.TX_DOMAIN_URL_PRE +  "/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zhrws2112/800/zhrws2112/zhrws2112?sap-client=800",
						wsdl:path.join(__dirname.replace(IF.name,""),global.wsdl,"ZHR_SAVE_DOCUMENTS.xml"),
						func: "ZHRWS2112.ZHRWS2112_soap12.ZHRWS2112",
						Params: {
							DOCUMENT: "",
							DOCUMENT2: doc,
							DOC_SIZE:filesize ,
							DOU_NAME: filename
						},
						BasicAuth: global.TXSOAPAuth
					};
					MEAP.SOAP.Runner(option, function(err, res, data){
						if (!err) {
							uploadresult(Response,0,data)
						}
						else {
							Response.statusCode = 404;
							Response.end(JSON.stringify({
								RETURN_MESSAGE: "调用webservice发生错误",
								RETURN_SUBRC: 1
							}));
						}
					});
					
				}
				else {
					Response.statusCode = 404;
					Response.end(JSON.stringify({
						RETURN_MESSAGE: '调用MAS发生错误',
						RETURN_SUBRC: 1
					}));
				}
			});
	}

	function convertFile(srcname,pdfname,fileid,cb) {
		try {
			console.log("Conver File ", srcname, pdfname,fileid);
			{
				{
					console.log("Run Ghost Script");
					try {
						convertTxt(srcname);
						var cmd2pdf= "/opt/libreoffice4.2/program/soffice --headless --convert-to pdf:writer_pdf_Export --outdir "+"/tmp"+" "+srcname;
						console.log("cmd2pdf-->" + cmd2pdf);
						cp.exec(cmd2pdf, function(err, stdout, stderr) {
							console.log("[CASE] Run cmd2pdf ", err,'stdout: ' + stdout,'stderr: ' + stderr);
							var destdir = "/tmp/"+fileid;
							fs.mkdirSync(destdir);
							var cmd2img = "/opt/ghostscript-9.14/gs -dNOPAUSE -dBATCH -sDEVICE=jpeg -sOutputFile=" + destdir + "/p%03d.jpg " + pdfname;
							console.log("cmd2img is  ", cmd2img);
							cp.exec(cmd2img, function(err, stdout, stderr) {
								console.log("[CASE] Run cmd2img ", err,'stdout: ' + stdout,'stderr: ' + stderr);
								fs.unlink(srcname,function(){});
								fs.unlink(pdfname,function(){});
								if ( stdout.match(/Processing pages (.*) through (.*)\./) ) {
									cb(0, {pagecount:RegExp.$2},destdir);
								}
								else
									cb(-1,"Convert File Failed");
							});
						});
					} catch(e) {
						cb(-1,e.message);
					}

				}
			}
			//);
		} catch(e) {
			cb(-1, "Conver document fail. " + e.message);
		}
	}

	function convertTxt(filename){
		if(path.extname(filename) != '.txt') return;
		var buf = fs.readFileSync(filename);
		var type = [buf[0],buf[1],buf[2]].join(''),encoding = 'UTF-8';
		switch(type){
			case '239187191' :
			break;	
			case '2542550' :
				buf = MEAP.AJAX.Convert(buf,"utf16be",encoding);
			break;	
			case '25525448' :
				buf = MEAP.AJAX.Convert(buf,"utf16le",encoding);
			break;	
			default :
				buf = MEAP.AJAX.Convert(buf,"gbk",encoding);
			break;	
		}
		fs.writeFileSync(filename,buf);
	}

	var loop = 0;
	var thumb=[];
	var doc_id = "";  
	function uploadresult(Response,err,data){
		loop++;
		console.log(count, "loop-->" + loop);
		console.log("doc_id-->" + data.RETRUN_DOC_ID );
		if(loop == 1){
			doc_id = data.RETRUN_DOC_ID;
		}else{
			thumb.push(data.RETRUN_DOC_ID);
		}
		
		if(loop == count + 1)
		{
              loop  =0;
              count = 0;
              console.log('{doc_id:doc_id,imgs:thumb}',{doc_id:doc_id,imgs:thumb});
			  Response.setHeader("Content-type", "text/json;charset=utf-8");
              var returnObj = {RETURN_SUBRC:0,doc_id:doc_id,imgs:thumb};
			 Response.end(JSON.stringify(returnObj));
		}
	}

exports.Runner = run;
