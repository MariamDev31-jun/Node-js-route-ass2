const path=require('node:path');
const fs=require('node:fs');
const {EventEmitter}=require('node:events');
const event=new EventEmitter();
const os = require("node:os")
const zlib=require('node:zlib');
const http=require('node:http')
//Q1
function fileInfo(){
console.log(
    {
        File:__filename,
        Dir:__dirname});
    }
fileInfo();


//Q2
function getFileName(filePath)
{
return path.basename(filePath);
}
console.log(getFileName('/user/files/report.pdf'));


//Q3
function mkDir(filePath) {
    return path.format(filePath);
}
console.log(mkDir({ dir: "\\folder", name: "app", ext: ".js" }));



// Q4
function getExtension(filePath)
{
    return path.extname(filePath);
}
console.log(getExtension('\\docs\\readme.md'));


//Q5
function pathParse(filePath) {
    const parsed = path.parse(filePath);

    return {
        Name: parsed.name,
        Ext: parsed.ext
    };
}
console.log(pathParse("/home/app/main.js"));


//Q6
function pathType(filePath){
    return path.isAbsolute(filePath);
}
console.log(pathType('/home/user/file.txt'));


//Q7
function pathJoin(...segments) {
    return path.join(...segments);
}
console.log( pathJoin("src", "components", "App.js"));


//Q8
function pathResolve(filePath)
{
    return path.resolve(filePath);
}
console.log(pathResolve('./index.js'));


//Q9
function pathJoin(...paths)
{
 return path.join(...paths);
}
console.log(pathJoin('/folder1', 'folder2/file.txt'));


// Q10
function delFile(filePath)
{
    fs.unlink(filePath,(err) => {
        if (err){

            return  console.log(err);

        }
        console.log(('The '+path.basename(filePath)+' is deleted.'));
    });
}
delFile('D:\\Route_Node_js\\core_modules\\file.txt');



//Q11
function fsMkdir(filePath){
    try{
        fs.mkdirSync(filePath);
        console.log('success');
    }catch(err)
    {
        console.log(err)
    }
}
fsMkdir('D:\\Route_Node_js\\core_modules\\testmkdir');


//Q12
event.on("start", function (){
    console.log('Welcome event triggered!');
})
event.emit("start");



//Q13
    event.on("login", function (username){
        console.log('User logged in: '+username);
    })
event.emit("login",'Mariam');



//Q14
function fsReadFile(filePath){
try{
   const data= fs.readFileSync(filePath,'utf8');
    console.log(data);
}catch(err){
    console.log(err);
}
}
fsReadFile('D:\\Route_Node_js\\core_modules\\notes.txt');


//Q15
function writeFileAsync(filePath, content) {
    fs.writeFile(filePath, content, (err) => {
        if (err) {
           return console.log(err);
        }
        console.log("File written successfully");
    });
}
writeFileAsync(
    "D:\\Route_Node_js\\core_modules\\async.txt",
    "Async save"
);


//Q16
// check if a directory exists"notes is not directory
function checkDir(path) {
    fs.stat(path, (err, stats) => {
        if (err) {
            return  console.log(err);
        }
        console.log(stats.isDirectory());
    });
}
checkDir("D:\\Route_Node_js\\core_modules\\notes.txt");
// If the question means "check if the path exists"
console.log(fs.existsSync("D:\\Route_Node_js\\core_modules\\notes.txt"));



//Q17
function getOSInfo() {
    return {
        Platform: os.platform(),
        Arch: os.arch()
    };
}
console.log(getOSInfo());


//Q18
const readStream=fs.createReadStream("D:\\Route_Node_js\\core_modules\\big.txt");
readStream.on('data',(chunk)=> {
    console.log("Chunk:");
    console.log(chunk);
})
readStream.on("end", () => {
    console.log("Finished reading");
});


//Q19
const writeStream=fs.createWriteStream("D:\\Route_Node_js\\core_modules\\dest.txt");
readStream.pipe(writeStream);//I used the readStream from Q18


//Q20
const writeStreamg = fs.createWriteStream("D:\\Route_Node_js\\core_modules\\data.txt.gz");
const gzip=zlib.createGzip();
readStream.pipe(gzip).pipe(writeStreamg);//I used the readStream from Q18


//===================part2======================


//Q1
let users =JSON.parse(fs.readFileSync("D:\\Route_Node_js\\core_modules\\users.json"));
const server=http.createServer((req, res) => {
let {method, url} = req;
let body = '';
if(method === 'POST' && url==='/user'){
    req.on('data',(chunk)=> {
        body += chunk;
    })
    req.on('end', () => {
        body=JSON.parse(body);

        let exist=users.find((user)=>
        {
            return user.email === body.email;
        })
        if(exist){
            res.writeHead(409,{'Content-Type': 'application/json'});
            return  res.end(JSON.stringify({
                message: "email already exists"
            }));
        }
        users.push(body);
        fs.writeFileSync("D:\\Route_Node_js\\core_modules\\users.json",JSON.stringify(users));
        res.writeHead(201,{'Content-Type': 'application/json'}) ;
        res.end(JSON.stringify({message :"user added successfully"}));
    })

}


//=================Q2===================
    else if (method === "PATCH" && url.startsWith("/user/")) {

        const id = url.split("/").at(-1);
        let body = "";

        const exist = users.find(user => user.id == id);

        if (!exist) {
            res.writeHead(404, {
                "Content-Type": "application/json"
            });

            return res.end(JSON.stringify({
                message: "User not found"
            }));
        }

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            body = JSON.parse(body);
            exist.name = body.name ?? exist.name;
            exist.email = body.email ?? exist.email;
            exist.age = body.age ?? exist.age;

            fs.writeFileSync(
                "D:\\Route_Node_js\\core_modules\\users.json", JSON.stringify(users)
            );

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: `User ${Object.keys(body)} updated successfully`
            }));
        });
    }


    ////=================Q3===================
        else if(method === "DELETE" && url.startsWith("/user/")) {
            const id = url.split("/").at(-1);

        let index=users.findIndex((user)=>user.id == id);
        if (index<0) {
                res.writeHead(404, {'Content-Type': "application/json"});
                return res.end(JSON.stringify({message:"User not found"}));
            }
        users.splice(index, 1);
        fs.writeFileSync("D:\\Route_Node_js\\core_modules\\users.json", JSON.stringify(users)
        );
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: `User deleted successfully`
        }));

    }


    ////=================Q4===================
    else if(method === "GET" && url==="/user")
    {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(users));
    }


    ////=================Q5===================
    else if(method === "GET" && url.startsWith("/user/"))

    {
        let id =url.split("/").at(-1);
        let index=users.findIndex((user)=>user.id == id);
        if (index<0) {
            res.writeHead(404, {'Content-Type': "application/json"});
            return res.end(JSON.stringify({message:"User not found"}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(users[index]));
    }
else {
    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        message: "Route not found"
    }));
}
})
server.listen(3000);
