const express = require('express')
const app = express()
const path = require('path')
const port = 3000
var Gpio = require('onoff').Gpio //require onoff to control GPIO
var pin9 = new Gpio(9, 'out')
var pin10 = new Gpio(10, 'out')
var pin11 = new Gpio(11, 'out')

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'))
})

app.get('/gpio/setup', (req, res) => {
  var data = {"status": "OK",
	"pins": req.query.pins,
	"mode": req.query.mode}

  for(let i=0; i<data.pins.length;i++){
   console.log(data.pins[i]);
   if(data.pins[i]=='9'){
    pin9.setDirection(data.mode)
   }
   else if(data.pins[i]=='10'){
    pin10.setDirection(data.mode)
   }
   else if(data.pins[i]=='11'){
    //console.time('clock-setup')
    pin11.setDirection(data.mode)
    //console.timeEnd('clock-setup')
   }
   else{
    console.log("Pin not expected")
   }
  }
  res.json(data)
})

app.get('/gpio/write', (req, res) => {
  var data = {"status": "OK", 
	"pin": req.query.pin,
	"value": req.query.value }
  if(data.pin=='9'){
    pin9.write(Number(data.value), err=>{
     if(err) console.log("fail write pin9")
    })
  }
  else if(data.pin=='10'){
    pin10.write(Number(data.value), err=>{
     if(err) console.log("fail write pin10")
    })
  }
  else if(data.pin=='11'){
    //console.time("clock-write")
    pin11.write(Number(data.value), err=>{
     if(err) console.log("fail write pin11")
    })
    //console.timeEnd("clock-write")
  }
  else{
    console.log("Pin not expected")
  }
  res.json(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

process.on('SIGINT', _ => {
  pin9.unexport();
  pin10.unexport();
  pin11.unexport();
  process.exit(0)
});
