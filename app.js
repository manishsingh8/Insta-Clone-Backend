const express =  require('express');
const {mongoUrl} = require('./keys');//because two veriable in keys tha't why used brases
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const cors = require('cors');//cross origin resource sharing error occure when sharing data b/w two diff url

app.use(cors());

require('./models/model');
require('./models/post');


app.use(express.json());
app.use(require('./routes/auth'));//middleware
app.use(require('./routes/createPost'));
mongoose.connect(mongoUrl);

mongoose.connection.on("connected",()=>{
      console.log("Successfully Connected to mongo ");
});

mongoose.connection.on("Error",()=>{
      console.log("Not Connected");
});


app.listen(port,()=>{
      console.log('server is runnig on port:',port);
})