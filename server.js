'use strict';
const express = require ('express');
const axios = require ('axios');
const cors = require ('cors');
const mongoose = require ('mongoose');

const server= express();

require('dotenv').config();
server.use(cors());
server.use(express.json());

const PORT=process.env.PORT;

mongoose.connect('mongodb://localhost:27017/digimon', {useNewUrlParser: true, useUnifiedTopology: true});
const digimonSchema = new mongoose.Schema({
    name: String,
    img:String,
    level:String
  });

  const digimonModal = mongoose.model('digion', digimonSchema);

server.get('/',(req,res)=>{
    res.send('Hello from my server')
})

server.get('/getData',getDataHandler);
server.post('/addToFav',addToFavHandler);
server.get('/getFavData',getFavDataHandler);
server.delete('/deleteData/:id',deleteDataHandler);
server.put('/updateData/:id',updateDataHandler);


class Digimon{
    constructor(item){
        this.name=item.name;
        this.img=item.img;
        this.level=item.level;
    }
}

function getDataHandler(req,res){
    const url=`https://digimon-api.vercel.app/api/digimon`;

    axios.get(url).then(result=>{
        let digimonArr=result.data.map(item=>{
            return new Digimon(item);
        })
        res.send(digimonArr);
    })
}

function addToFavHandler(req,res){
    const {name,img,level}=req.body;

    let newDigimon= new digimonModal({
        name:name,
        img:img,
        level:level
    })
    newDigimon.save();
}

function getFavDataHandler(req,res){
    digimonModal.find({},(error,data)=>{
        res.send(data)
    })
}

function deleteDataHandler(req,res){
    const id= req.params.id;
    // const {name,img,level}=req.body;
console.log(id);
    digimonModal.remove({_id:id},(error,data)=>{
       
            res.send(data);
      
    })  
}

function updateDataHandler(req,res){
    const id = req.params.id;
    const {digName, digURL, digLevel}= req.body;

    digimonModal.findOne({_id:id},(error,data)=>{
        data.name=digName,
        data.img=digURL,
        data.level=digLevel,

        data.save().then(()=>{
            digimonModal.find({},(error,data)=>{
                res.send(data)
            })
        })
    })
}


server.listen(PORT,()=>{
    console.log(`Worked!! ${PORT}`);
})