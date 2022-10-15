const { response } = require("express");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8080;
const https = require("https");
const path = require('path');
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

var indexRouter = require('./routes/app');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);

app.use(express.static(path.resolve('./public')));
app.listen(8080, () => {
    console.log('http://localhost:8080/');
})

module.exports =app;
// admin.initializeApp({
//   credential: admin.credential.cert(credentials)
// });

// const db=admin.firestore();

// app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: true }));


// app.post('/',async (req,res)=>{
//   try{
//     const id=req.body.dusername;
//     const UserJson={
        
//          firstname:req.body.dfname,
//          lastname:req.body.dlname,
//          username:req.body.dusername,
//          email: req.body.demail,
//          password:req.body.dpassword,
//          age:req.body.dage,
//          gender:req.body.dgender,
//          Salutation:req.body.dsalutation,
//          Qualification:req.body.dqualification,
//          Specialization:req.body.dspecialization,
//          SuccessRate:req.body.dsuccessrate,
//          Experience:req.body.dexperience,
//          previousHospitals:req.body.dprevhospnames,
//          city:req.body.dcity,
//          state:req.body.dstate,
//          pincode:req.body.dpincode
//     }
//     console.log(UserJson);
//     const response=db.collection("doct_data").doc(id).set(UserJson);
//     console.log(response); 
//     res.end()
// }catch(error){
//     res.send(error);
// }
// });


// app.post('/ptSignUP.html',async (req,res)=>{
//   try{
//     const id=req.body.ptname;
//     const UserJson={
//         name:req.body.ptname,
//         password:req.body.pt_crt_pass
         
//     }
//     console.log(UserJson);
//     const response=db.collection("patient_data").doc(id).set(UserJson);
//     console.log(response); 
//     res.end()
// }catch(error){
//     res.send(error);
// }
// });


// app.listen(port, () => {
//   console.log('http://localhost:8080/');
// })
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });
// app.get("/doctsignup", (req, res) => {
//   res.sendFile(__dirname + "/doctSignUP.html");
// });
// app.get("/doctsignup", (req, res) => {
//   res.sendFile(__dirname + "/doctSignUP1.html");
// });
// app.get("/ptSignUP",(req,res)=>{
//   res.sendFile(__dirname + "/doctSignIN.html");

// })
app.use(express.static(path.resolve('./public')));