const mongoose = require("mongoose");
const express = require("express");
// const session = require("express-session");
// const fileStore = require("session-file-store")(session)
const Data = require("./data");
const User = require("./user");

const bcrypt = require('bcrypt');

const API_PORT = 3001;
const app = express();
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb://localhost/Events";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
).then(console.log("MongoDB has started")).catch(e => console.log(e));
mongoose.set('useCreateIndex', true);


let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create method
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Data();
  const { time, message } = req.body;
  if (!message || !time) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.message = message;
  data.time = time;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

/*-----------REGISTRATION-----------*/

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(
//   session({
//     secret: 'Artur',
//     store: new fileStore(),
//     cookie: {
//       path: '/',
//       httpOnly: true,
//       maxAge: 60 * 60 * 12000,
//     },
//     resave: false,
//     saveUnicializated: false,
//   }));

router.post("/create", (req, res) => {

  let { username, password } = req.body,
    user = new User();

  if (!username || !password) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  let salt = bcrypt.genSaltSync(10),
    hash = bcrypt.hashSync(password, salt);

  user.password = hash;
  user.username = username;

  user.save(err => {
    if (err) {
      return res.json({ success: false, error: err });
    }
    return res.json({ success: true });
  });

});



const passport = require('passport');
require('./password-config');

app.use(passport.initialize());
// app.use(passport.session());

router.get('/login', 
function (req, res, next) {
  passport.authenticate('token', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      return res.send('test');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return user.username;
    });
  })(req, res, next);
});

/* if (err) { return next(err); }
    if (!user) {
      return res.send('test');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return user.username;
    });
  })(req, res, next);*/

const auth = (req, res, next) => {
  if (req.Authenticated()) {
    next()
  } else {
    res.redirect('/registration')
  }
}
router.get("/main", auth)

/*-----------END REGISTRATION-----------*/

/*-----------LOGIN-----------*/
// require('./password-config');

// app.post('/login',
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   function (req, res) {
//     res.redirect('/');
//   });

/*-----------END LOGIN-----------*/

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));