var express = require('express');
var router = express.Router();
const { async } = require("@firebase/util");
const {FieldValue} = require('firebase-admin/firestore');
const ejs=require('ejs');
const {db}=require('../firebase.js')

//to create doctors
router.post('/dcreate',async (req,res)=>{
    try{
      const id=req.body.dusername;

      const UserJson={
          
           firstname:req.body.dfname,
           lastname:req.body.dlname,
           username:req.body.dusername,
           email: req.body.demail,
           password:req.body.dpassword,
           age:req.body.dage,
           gender:req.body.dgender,
           Salutation:req.body.dsalutation,
           Qualification:req.body.dqualification,
           Specialization:req.body.dspecialization,
           SuccessRate:req.body.dsuccessrate,
           Experience:req.body.dexperience,
           previousHospitals:req.body.dprevhospnames,
           city:req.body.dcity,
           state:req.body.dstate,
           pincode:req.body.dpincode
      }
      console.log(UserJson);
      const response=db.collection("doct_data").doc(id).set(UserJson);
      console.log(await response); 
      
      res.send("<h1>Successfully Signed Up</h1>")
  }catch(error){
      res.json("hello");
  }
  });
  
  

//to create patients
router.post('/ptcreate',async (req,res)=>{
  try{
    const id2=req.body.ptname;
    const UserJson={
        name:req.body.ptname,
        password:req.body.pt_crt_pass,
        age:req.body.ptage,
        weight:req.body.ptweight,
        gender:req.body.ptgender,
        problem:req.body.ptprob
    }
    console.log(UserJson);
    if(req.body.ptname=='' || req.body.pt_crt_pass=='' || req.body.ptage==''|| req.body.ptweight=='' || req.body.ptprob=='' ){
        res.send("fill the details it is compulsory");
    }
    else{
    const response=db.collection("patient_data").doc(id2).set(UserJson);
    console.log(await response); 
    res.json("successfully signed up to know about doctors please sign in");
    }
}catch(error){
    res.send(error);
}
});
var a,b,d;

//to open doctor signed in page whith doctor username
router.post('/doctSignIN1',async (req,res)=>{
    const id1=req.body.doctor_username;
        const id2=req.body.doct_password;
        const userRef1=db.collection("doct_data").doc(id1);
        const userRef2=db.collection("appointments")
        const userRef3=db.collection("pt_msg")
        //console.log(userRef1);
        const doc=await userRef1.get();
        const doc1=await userRef2.get();
        const doc2=await userRef3.get();
    try{
        
        db.collection("doct_data").where("username","==",id1).where("password","==",id2).get()
        .then((docs)=>{
            if(docs.size >0){
                //console.log(doc);
                if(!doc.exists){
                    console.log('no doctor available');
                }
                else{

                    //console.log('doc data',doc.data());
                    a=doc.data();
                    const dname=a.username;
                    const dspecialization=a.Specialization;
                    const dsuccessrate=a.SuccessRate;
                    const dqualification=a.Qualification;
                    const dsalutation=a.Salutation;
                    const dexperience=a.Experience;
                    const dprevhospnames=a.previousHospitals;
                    const demail=a.email;
                    var l=new Array();
                    doc1.forEach(ele=>{
                        if((ele.data()).docname==id1){
                            var a1=(ele.data()).patient;
                            var a2=(ele.data()).docname;
                            l.push({patientname:a1,docname:a2});
                            //console.log(a1);
                            // console.log(a2);
                            //console.log((ele.data()).patient);
                        }
                        
                    })
                    if(l.length==0){
                        var s="no more appointments";
                    }
                    var m=new Array();
                    doc2.forEach(ele=>{
                        if((ele.data()).to==id1){
                            var f1=(ele.data()).from;
                            var t1=(ele.data()).to;
                            var ms1=(ele.data()).mess;
                            m.push({MessageFrom:f1,Messageto:t1,Message:ms1});
                            console.log(m)
                        }
                    })
                    if(l.length==0){
                        var s1="no messages";
                    }
                    console.log(l);
                    res.render('doctSignIN1',{s1:s1,dname:dname,dspecialization:dspecialization,dsuccessrate:dsuccessrate,dqualification:dqualification,dsalutation:dsalutation,dexperience:dexperience,dprevhospnames:dprevhospnames,demail:demail,l:l,s:s,m:m
                    
                    });
                    //res.render('doctSignIN1');
                }

            }
            else{
                res.send("incorrect details")
            }
            
        })
        

        //console.log(userRef1)

    }catch(error){
        res.json("hello");
    }
})

router.post('/docmsg',async (req,res)=>{
    try{
        const id1=req.body.from1;
        const id2=req.body.to1;
        const id3=req.body.m2;

        const UserJson={
             from:id1,
             to:id2,
             mess:id3
        }
        console.log(UserJson);
        const response=db.collection("doc_msg").add(UserJson);
        //console.log(await response); 
        res.json("Successfully sent your message");
    }catch(error){
        res.json("hello");
    }
})

router.post('/doctSignIN2',async (req,res)=>{
    const id6=req.body.dd;
    const id7=req.body.pp;
    const id8=req.body.tim;
    const id9=req.body.tim1;
    try{
        const UserJson={
            docName:id6,
            ptName:id7,
            date:id8,
            time:id9
        }
        const response=db.collection("accepted_appo").doc(id7).set(UserJson);
        const resp=db.collection("appointments").doc(id7).delete();
        res.json("successfully accepted ");

    }
    catch(error){
        res.send("hello")
    }
})

router.post('/statusChecker',async (req,res)=>{
    const id10=req.body.pt2name;
    const id11=req.body.d1name;
    try{
        const userRef=db.collection("accepted_appo");
        const userRef1=db.collection("appointments");
        const userRef2=db.collection("doc_msg");

        const doc=await userRef.get();
        const doc1=await userRef1.get();
        const doc2=await userRef2.get();

        let s;
        let m=[];
        doc2.forEach(ele=>{
            if((ele.data()).to==id10){
                var f1=(ele.data()).from;
                var t1=(ele.data()).to;
                var ms1=(ele.data()).mess;
                m.push({MessageFrom:f1,Messageto:t1,Message:ms1});
                console.log(m)
            }
        })

        doc.forEach(ele=>{
            if((ele.data()).ptName==id10){
                s="accepted";
                const d1=(ele.data()).docName;
                const p1=(ele.data()).ptName;
                const date=(ele.data()).date;
                const time=(ele.data()).time;
                //res.json("accepted");
                res.render('statusChecker',{m:m,d1:d1,p1:p1,date:date,time:time,s:s})
            }
        })
        doc1.forEach(e=>{
            if((e.data()).patient==id10){
                //res.json("pending");
                s="pending";
                const d1=(e.data()).docname;
                const p1=(e.data()).patient;
                res.render('statusChecker',{m:m,d1:d1,p1:p1,s:s})
            }
        })
    }
    catch(error){
        res.json("hello")
    }
})

//to open the signed in page with patient username
router.post('/ptSignIN1', async (req,res)=>{
    const id3=req.body.pt_username;
    const id4=req.body.pt_password;
    const userRef3=db.collection("patient_data").doc(id3);
    const userRef4= await db.collection("doct_data");
    const doc1=await userRef4.get();
        //console.log(userRef1);
    const doc=await userRef3.get();
    try{
        db.collection("patient_data").where("name","==",id3).where("password","==",id4).get()
        .then((docs)=>{
            if(docs.size >0){
                //console.log(doc);
                if(!doc.exists){
                    console.log('no patient available');
                }
                else{
                    console.log('patient data',doc.data());
                    b=doc.data();
                    const pname=b.name;
                    const page=b.age;
                    const pgender=b.gender;
                    const pweight=b.weight;
                    const pproblem=b.problem;
                    var da=[];
                    doc1.forEach(ele=> {
                        da.push(ele.id);
                        //console.log(da);
                    });
                    var i=0;
                    var l = new Array();
                    da.forEach(async ele=>{
                        const u5= await userRef4.doc(ele).get();
                        var c=u5.data();
                        l.push({Name:c.username,Qualification:c.Qualification,Specialization:c.Specialization});
                        
                        i=i+1;
                        if(i==da.length){
                            // console.log(l);
                            //  res.json(l);
                            //res.send('ptSignIN1')
                            res.render('ptSignIN1',{pname:pname,page:page,pgender:pgender,pweight:pweight,pproblem:pproblem,l:l})
                            console.log(l)
                        }
                        
                    })
                }
            }
            else{
                res.send("incorrect details")
            }
        })
        
    }catch(error){
        res.json("hello");
    }
})


router.post('/doctDet',async (req,res)=>{
    const id4=req.body.ddname;
    const id5=req.body.p11name;
    console.log(id4);
    console.log(id5);
    //const id5=req.body.ptname;
    try{
        const userRef6=db.collection("doct_data").doc(id4);
        //console.log(userRef1);
        const doc=await userRef6.get();
        
        //console.log(data);
        //console.log(pt1name);
        if(!doc.exists){
            console.log('no doctor available');
        }
        else{
            console.log('doc data',doc.data());
            d=doc.data();
            const dname=d.username;
            const dspecialization=d.Specialization;
            const dqualification=d.Qualification;
            const dsuccessrate=d.SuccessRate;
            const dprevioushosp=d.previousHospitals;
            const demail=d.email;
            const dsalutation=d.Salutation;
            //res.render('doctSignIN1',{dname:dname});
            res.render('doctDet',{id5:id5,dname:dname,dspecialization:dspecialization,dqualification:dqualification,dsuccessrate:dsuccessrate,dprevioushosp:dprevioushosp,demail:demail,dsalutation:dsalutation});
        }
        //console.log(userRef1)

    }catch(error){
        res.json("hello");
    }
})

router.post('/ptmsg',async (req,res)=>{
    try{
        const id1=req.body.from;
        const id2=req.body.to;
        const id3=req.body.m1;

        const UserJson={
             from:id1,
             to:id2,
             mess:id3
        }
        console.log(UserJson);
        const response=db.collection("pt_msg").add(UserJson);
        //console.log(await response); 
        res.json("Successfully sent your message");
    }catch(error){
        res.json("hello");
    }
})

router.post('/appo',async (req,res)=>{
    try{
        const id5=req.body.pt1name;
        const UserJson={
            
             patient:req.body.pt1name,
             docname:req.body.d1name
        }
        console.log(UserJson);
        const response=db.collection("appointments").doc(id5).set(UserJson);
        console.log(await response); 
        res.json("Successfully sent your appointment request");
    }catch(error){
        res.json("hello");
    }

})
router.post('/doctSignin',(req,res)=>{
    res.send("hello");
})
router.post('/ptSignUP1',(req,res,next)=>{
    res.render('ptSignUP1')
})


router.post('/doctSignUP1',(req,res,next)=>{
    const ad=req.body.adun;
    const pd=req.body.adpd;
    db.collection("adminDetails").where("AdminUserName","==",ad).where("Password","==",pd).get()
    .then((docs)=>{
        if(docs.size >0){
            res.render('doctSignUP1');

        }
        else{
            res.send("incorrect details");
        }
    })

})
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Hospital Management' });
  });

router.get('/doctSignUP',(req,res,next)=>{
    res.render('doctSignUP')
    
})
router.get('/doctSignUP1',(req,res,next)=>{
    res.render('doctSignUP1')
    
})
router.get('/doctSignIN',(req,res,next)=>{
    res.render('doctSignIN')
    
})
router.get('/ptSignUP',(req,res,next)=>{
    res.render('ptSignUP')
    
})
router.get('/ptSignIN',(req,res,next)=>{
    res.render('ptSignIN')
    
})
module.exports=router;