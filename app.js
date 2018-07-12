// 引入http模块
let http=require('http');
// 引入路径模块
let path=require('path');
// 引入文件fs模块
let fs=require('fs');
// 引入字符串模块
let qs=require('querystring');
// 引入第三方模块mime
let mime=require('mime');
// 引入mysql
let mysql=require('mysql');
// 引入模板引擎
let tem=require('art-template');


// 创建一个根目录
let rootpath=path.join(__dirname,'www');

http.createServer((request,response)=>{
    // 获取请求目录,给请求url解码
    let filepath=path.join(rootpath,qs.unescape(request.url));
//    判断这个文件是否存在
    if(fs.existsSync(filepath)){
    //    文件存在，需要判断这个文件是文件夹还是文件
        fs.readdir(filepath,(err,files)=>{
            if(err){
            //   是文件， 读取问件
            fs.readFile(filepath,(err,data)=>{                       
                response.writeHead(200,{
                    'content-type':mime.getType(filepath)
                })
                response.end(data);
            })
            }else{
                // 是文件夹，先判断有没有首页，有首页直接渲染
                
                if(files.indexOf('index.html')!=-1){
                    //连接数据库
                    var connection = mysql.createConnection({
                        host     : 'localhost',
                        user     : 'root',
                        password : 'root',
                        database : 'test'
                      });
                    //   开启数据库
                      connection.connect();
                    //   查询数据库
                      connection.query('select * from manyhero', function (error, results, fields) {
                        if (error) throw error;
                        
                        var html = tem(__dirname + '/www/index.html', {
                            results
                        });
                        response.end(html);

                      });
                    //   关闭数据库
                     connection.end();
                     
                    
                }else{
                    // 渲染文件夹
                    let datastr='';
                    for(let i=0;i<files.length;i++){
                        
                        datastr+=`<h2><a href='${request.url=='/'?'':request.url}/${files[i]}'>${files[i]}</a></h2>`;
                    }
                    response.writeHead(200,{
                        'content-type':'text/html;charset=utf-8'
                    })
                    response.end(datastr);
                    
                   
                }
               
            }
        })
    }else{
        // 说明文件不存在，404
        response.writeHead(404,{
            'content-type':'text/html;charset=utf-8'
        })
        response.end(`<h1>not find 404</h1>`);
    }

}).listen(80,'127.0.0.1',()=>console.log('开启监听'));