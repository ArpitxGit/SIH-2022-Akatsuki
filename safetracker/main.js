const express = require("express");
path = require("path");
bodyParser = require("body-parser");
multer = require("multer");
fs = require("fs");
methodOverride = require("method-override");
var Web3 = require("web3");

var app = express();
var request = require("request");

var mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

// ======== //

// redefining paths //

app.use(express.static(path.join(__dirname, "/public")));
app.use("*/farmer", express.static(__dirname + "/public"));
app.use("*/farmer/:id/editprofile", express.static(__dirname + "/public"));
app.use("*/newcrop", express.static(__dirname + "/public"));
app.use("*/farmerinfo", express.static(__dirname + "/public"));
app.use("*/showpage", express.static(__dirname + "/public"));
app.use("*/showpage/:id/:ecname", express.static(__dirname + "/public"));
app.use("*/farmer/:id/:ecname", express.static(__dirname + "/public"));
app.use("*/delete/:id/:k/:ecname", express.static(__dirname + "/public"));

// ======== //

app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/safetracker");

mongoose.pluralize(null);

var farmer_Schema = new mongoose.Schema({
  name: String,
  number: Number,
  pass: String,
  customerpass: String,
  farmerstate: String,
  farmerstatus: Boolean,
  cropsinfo: String,

  imgprofile: {
    data: Buffer,
    contentType: String,
  },

  ecropdata: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ecropdata",
    },
  ],
  landdata: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "landdata",
    },
  ],
});

var livedata_Schema = new mongoose.Schema({
  sensorid: Number,
  beforedate: String,
  afterdate: String,
  beforetemp: String,
  aftertemp: String,
  beforehumid: String,
  afterhumid: String,
});

var ecrop_Schema = new mongoose.Schema({
  ecname: String,
  placec: String,
  start: String,
  end: String,
  placet: String,
  extrainfo: String,
  blockurl: String,
  img: [
    {
      data: Buffer,
      contentType: String,
    },
  ],
});

var land_Schema = new mongoose.Schema({
  ecname: String,
  placec: String,
  start: String,
  end: String,
  placet: String,
  extrainfo: String,
  blockurl: String,
  img: [
    {
      data: Buffer,
      contentType: String,
    },
  ],
});

var ecropdata = mongoose.model("ecropdata", ecrop_Schema);
var landdata = mongoose.model("landdata", land_Schema);

var farmer = mongoose.model("farmer", farmer_Schema);
var livedata = mongoose.model("livedata", livedata_Schema);

// middlewares //

var imagestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/ecrop");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: imagestorage });

var landstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/land");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
var landupload = multer({ storage: landstorage });

var profileimagestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/profile");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var uploadprofile = multer({ storage: profileimagestorage });

// routes start here //

app.get("/", function (req, res) {
  res.render("safetracker");
});

app.get("/safetracker.ejs", function (req, res) {
  res.render("safetracker");
});

app.get("/signup.ejs", function (req, res) {
  res.render("signup");
});
app.get("/signin.ejs", function (req, res) {
  res.render("signin");
});
app.get("/search.ejs", function (req, res) {
  res.render("search");
});

// app.get("/connect", function (req, res) {
//   console.log("good");
//   const connect = (event) => {
//     try {
//       console.log("connecting");
//       if (window.ethereum) {
//         window.web3 = new Web3(window.ethereum);
//         window.ethereum.enable();
//       }
//       if (window.web3) {
//         window.web3 = new Web3(window.web3.currentProvider);
//       } else {
//         return window.alert("Please install MetaMask!");
//       }
//       //setWeb3(window.web3)
//       const web3 = window.web3;

//       //deployed contract address :: 0x2496480d827E12aCAc35aA21a6Ec5b3D02e6816E
//       //const contract_address = "0x2496480d827E12aCAc35aA21a6Ec5b3D02e6816E";
//       //current wallet address
//       const accounts = web3.eth.getAccounts();
//       //default account who will be taking actions
//       web3.eth.defaultAccount = accounts[0];
//       console.log("Default Acoount : " + accounts[0]);
//       console.log(account[0]);

//       //entered address from UI :: (to_account) for which NFT will be minted
//       //console.log(enteredAddress);

//       //creating instance of smart contract
//       //const med = new web3.eth.Contract(abi, contract_address, {});

//       // const response = await med.methods.mintByOwner(enteredAddress,fileURL).send({from:web3.eth.defaultAccount})
//       // console.log(response)
//       // if(response?.status){
//       //     // console.log("Transaction Hash of Minting: "+transactionHash);
//       //     // printing the log of transaction
//       //     console.log("Response From mintByOwner: ", response);
//       //     const TOKENID = response?.events?.Transfer?.returnValues?.['2'];
//       //     const chainID=await window.web3.eth.getChainId()
//       //     const network=getNetworkFromChainId(chainID)
//       //     //window.alert("NFT Minted Successfully!");
//       // }
//     } catch (error) {
//       console.log("caught", error);
//     }
//   };
// });

app.get("/farmerinfo/:id", function (req, res) {
  var farmer_id = req.params.id;
  farmer.findById(farmer_id, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render("farmerinfo", { farmer: data, farmer_id: farmer_id });
    }
  });
});
app.get("/farmer/:id", function (req, res) {
  farmer
    .findById(req.params.id)
    .populate("ecropdata")
    .exec(function (err, data) {
      if (err) {
        console.log(err);
        res.send("there is a error");
      } else {
        res.render("farmerhome", { farmer: data });
      }
    });
});
app.get("/newcrop/:id", function (req, res) {
  var user_id = req.params.id;
  res.render("newcrop", { farmer_id: user_id });
});

app.get("/showpage/:id/:ecname/", function (req, res) {
  var ecropname = req.params.ecname;
  farmer
    .findById(req.params.id)
    .populate("ecropdata")
    .exec(function (err, user) {
      if (err) {
        console.log(err);
        res.send("there is a error");
      } else {
        res.render("showpage", { farmer: user, ecropname: ecropname });
      }
    });
});

app.get("/logout/:id", function (req, res) {
  var id1 = req.params.id;
  farmer.findByIdAndUpdate(
    id1,
    { farmerstatus: false },
    function (err, dataus) {
      if (err) {
        console.log(err);
      } else {
        console.log(dataus.farmerstatus);
      }
    }
  );

  res.redirect("/farmer/" + id1);
});

app.get("/farmer/:id/:ecname/:k/livedata/", function (req, res) {
  var ecropname = req.params.ecname;
  var k = req.params.k;
  console.log(k);
  console.log("good till here");

  farmer
    .findById(req.params.id)
    .populate("ecropdata")
    .exec(function (err, user) {
      if (err) {
        console.log(err);
        res.send("there is a error");
      } else {
        request(user.ecropdata[k].blockurl, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var livecropdata = JSON.parse(body);
            var liveobj = {
              sensorid: livecropdata["channel"]["id"],
              beforedate: livecropdata["feeds"][0]["created_at"],
              afterdate: livecropdata["feeds"][1]["created_at"],
              beforetemp: livecropdata["feeds"][0]["field1"],
              aftertemp: livecropdata["feeds"][1]["field1"],
              beforehumid: livecropdata["feeds"][0]["field2"],
              afterhumid: livecropdata["feeds"][1]["field2"],
            };
            console.log("good till here x2");
            livedata.create(liveobj, function (err, npa) {
              if (err) {
                console.log("error in saving to databsae");
              } else res.redirect("/farmer/" + ecropname + "/livedata/" + npa._id);
            });
          }
        });
      }
    });
});

app.get("/farmer/:ecname/livedata/:id", function (req, res) {
  var ecropname = req.params.ecname;
  livedata.findById(req.params.id, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render("livedata", { livedata: data, ecropname: ecropname });
    }
  });
});
app.get("/farmer/:ecname/livecost", function (req, res) {
  var ecropname = req.params.ecname;
  console.log(ecropname);
  ecropdata.findOne({ name: ecropname }, function (err, datas) {
    if (err) {
      console.log(err);
    } else {
      request(datas.blockurl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var livecropdata = JSON.parse(body);

          var precost = livecropdata["feeds"][0]["field4"];
          var pretime = livecropdata["feeds"][0]["created_at"];
          var posttime = livecropdata["feeds"][1]["created_at"];

          var currcost = livecropdata["feeds"][1]["field4"];

          console.log("good till here x2");
          res.render("livecost", {
            precost: precost,
            currcost: currcost,
            pretime: pretime,
            posttime: posttime,
            data: datas,
            ecrop: ecropname,
          });
        } else {
          console.log(error);
        }
      });
    }
  });
});

// post routes start here!!
//        sdfsfddafgadfg
//
//
// adcvdafvdgdfgdfvdvdfvbdfv
// cxdfvcxxvdf
// dfvdafgdfgadfvadfadfadfgadfggd
// adfgadfgadfgadf
// dafgadfgadfgafdg

app.post(
  "/farmerinfo/:id",
  uploadprofile.single("proimage"),
  function (req, res) {
    var obj1 = {
      farmerstate: req.body.farmerstate,
      cropsinfo: req.body.cropsinfo,

      img: {
        data: fs.readFileSync(
          path.join(__dirname + "/public/uploads/profile/" + req.file.filename)
        ),
        contentType: "image/png",
      },
    };

    farmer.findById(req.params.id, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        data.farmerstate = obj1.farmerstate;
        data.cropsinfo = obj1.cropsinfo;
        data.imgprofile = obj1.img;
        data.save(function (err, datao) {
          res.render("farmerhome", { farmer: data });
        });
      }
    });
  }
);

app.post("/newcrop/:id", upload.array("image"), function (req, res) {
  var imgarr = [];

  for (var i = 0; i < req.files.length; i++) {
    var imgobj = {
      data: Buffer,
      contentType: String,
    };

    imgobj.data = fs.readFileSync(
      path.join(__dirname + "/public/uploads/ecrop/" + req.files[i].filename)
    );
    imgobj.contentType = "image/png";
    imgarr.push(imgobj);
  }

  var obj = {
    ecname: req.body.ecname,
    placec: req.body.placec,
    start: req.body.start,
    end: req.body.end,
    placet: req.body.placet,
    extrainfo: req.body.extrainfo,
    blockurl: req.body.blockurl,
    img: imgarr,
  };

  ecropdata.create(obj, function (err, data) {
    if (err) {
      console.log("error in saving to databsae");
    } else {
      farmer.findById(req.params.id, function (err, founduser) {
        if (err) {
          console.log(err);
        } else {
          founduser.ecropdata.push(data);
          founduser.save(function (err, fulldata) {
            if (err) {
              console.log(err);
            } else {
              res.redirect("/farmer/" + req.params.id);
            }
          });
        }
      });
    }
  });
});

app.post("/newfarmer", function (req, res) {
  req.body.farmerstatus = "true";
  var info = req.body;

  farmer.create(info, function (err, npa) {
    if (err) {
      console.log("error in saving to databsae");
    } else res.redirect("/farmerinfo/" + npa._id);
  });
});

app.post("/member", function (req, res) {
  var checkn = req.body.your_name;
  var checkp = req.body.your_pass;
  farmer.findOneAndUpdate(
    { name: checkn, pass: checkp },
    { farmerstatus: true },
    function (err, datap) {
      if (datap === null) res.render("errorpage3");
      else if (checkn === datap.name && checkp === datap.pass) {
        res.redirect("/farmer/" + datap._id);
      } else console.log(err);
    }
  );
});
app.post("/search", function (req, res) {
  var fsearch = req.body.f;
  var cpass = req.body.c;
  console.log(req.body);
  console.log(fsearch);
  console.log(cpass);

  farmer.findOne({ name: fsearch, customerpass: cpass }, function (err, datas) {
    if (datas === null) {
      console.log("ye nahi hua");
      res.render("errorpage");
    } else if (fsearch === datas.name) {
      if (datas.farmerstatus === true) {
        res.render("errorpage2");
      } else res.redirect("/farmer/" + datas._id);
    } else {
      console.log(err);
    }
  });
});

// edit, update and delete routes

app.get("/farmer/:id/editp", function (req, res) {
  farmer.findById(req.params.id, function (err, dataep) {
    if (err) {
      console.log(err);
    } else {
      res.render("profile", { farmer: dataep });
    }
  });
});

app.get("/:ecname/refresh/:id", function (req, res) {
  var ecropname = req.params.ecname;
  ecropdata.findOne(
    { ecname: ecropname },

    function (err, datap) {
      if (datap === null) res.render("errorpage3");
      else if (err === null) {
        request(datap.blockurl, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var livecropdata = JSON.parse(body);
            var liveobj = {
              sensorid: livecropdata["channel"]["id"],
              beforedate: livecropdata["feeds"][0]["created_at"],
              afterdate: livecropdata["feeds"][1]["created_at"],
              beforetemp: livecropdata["feeds"][0]["field1"],
              aftertemp: livecropdata["feeds"][1]["field1"],
              beforehumid: livecropdata["feeds"][0]["field2"],
              afterhumid: livecropdata["feeds"][1]["field2"],
            };
            console.log("good till here x2");
            livedata.findByIdAndUpdate(
              req.params.id,
              liveobj,
              function (err, npa) {
                if (err) {
                  console.log("error in saving to databsae");
                } else
                  res.redirect("/farmer/" + ecropname + "/livedata/" + npa._id);
              }
            );
          }
        });
      } else console.log(err);
    }
  );
});

app.put(
  "/farmer/:id/editprofile/update",
  uploadprofile.single("imagep"),
  function (req, res) {
    // console.log(req.body);
    var obj1 = {
      farmerstate: req.body.farmerstate,
      cropsinfo: req.body.cropsinfo,
      pass: req.body.pass,
      name: req.body.name,

      imgprofile: {
        data: fs.readFileSync(
          path.join(__dirname + "/public/uploads/profile/" + req.file.filename)
        ),
        contentType: "image/png",
      },
    };

    farmer.findByIdAndUpdate(req.params.id, obj1, function (err, dataed) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/farmer/" + req.params.id);
      }
    });
  }
);

app.get("/farmer/:id/:ecname/edit", function (req, res) {
  var ecropname = req.params.ecname;
  farmer
    .findById(req.params.id)
    .populate("ecropdata")
    .exec(function (err, user) {
      if (err) {
        console.log(err);
        res.send("there is a error");
      } else {
        res.render("edit", { farmer: user, ecropname: ecropname });
      }
    });
});

app.put(
  "/farmer/:id/:ecname/:k/update",
  upload.array("image"),
  function (req, res) {
    var k = req.params.k;
    var ttname = req.body.ecname;
    var ttdesc = req.body.blockurl;

    var imgarr2 = [];

    for (var i = 0; i < req.files.length; i++) {
      var imgobj2 = {
        data: Buffer,
        contentType: String,
      };
      imgobj2.data = fs.readFileSync(
        path.join(__dirname + "/public/uploads/ecrop/" + req.files[i].filename)
      );
      imgobj2.contentType = "image/png";
      imgarr2.push(imgobj2);
    }

    farmer
      .findById(req.params.id)
      .populate("ecropdata")
      .exec(function (req, user1) {
        user1.ecropdata[k].img.push(...imgarr2);
        user1.save(function (err, dd) {
          console.log("good till here");
          if (err) {
            console.log(err);
          } else {
            ecropdata.findByIdAndUpdate(
              user1.ecropdata[k],
              { img: user1.ecropdata[k].img, ecname: ttname, blockurl: ttdesc },
              function (err, data) {
                if (err) {
                  console.log(err);
                } else {
                  res.redirect("/farmer/" + user1._id);
                }
              }
            );
          }
        });
      });
  }
);

app.delete("/delete/:id/:i/:ecname", function (req, res) {
  var i = req.params.i;
  console.log(i);

  farmer
    .findById(req.params.id)
    .populate("ecropdata")
    .exec(function (err, userd) {
      if (err) {
        console.log(err);
      } else {
        ecropdata.findByIdAndDelete(userd.ecropdata[i], function (err, datad) {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/farmer/" + req.params.id);
          }
        });
      }
    });
});

// /////////////////////////////////////////////////////////////////////

// land data =

app.post("/newland/:id", upload.array("imagel"), function (req, res) {
  var imgarr = [];

  for (var i = 0; i < req.files.length; i++) {
    var imgobj = {
      data: Buffer,
      contentType: String,
    };

    imgobj.data = fs.readFileSync(
      path.join(__dirname + "/public/uploads/land/" + req.files[i].filename)
    );
    imgobj.contentType = "image/png";
    imgarr.push(imgobj);
  }

  var obj = {
    ecname: req.body.ecname,
    placec: req.body.placec,
    start: req.body.start,
    end: req.body.end,
    placet: req.body.placet,
    extrainfo: req.body.extrainfo,
    blockurl: req.body.blockurl,
    img: imgarr,
  };

  landdata.create(obj, function (err, data) {
    if (err) {
      console.log("error in saving to databsae");
    } else {
      farmer.findById(req.params.id, function (err, founduser) {
        if (err) {
          console.log(err);
        } else {
          founduser.ecropdata.push(data);
          founduser.save(function (err, fulldata) {
            if (err) {
              console.log(err);
            } else {
              res.redirect("/farmer/" + req.params.id);
            }
          });
        }
      });
    }
  });
});

app.get("/showland/:id/:ecname/", function (req, res) {
  var ecropname = req.params.ecname;
  farmer
    .findById(req.params.id)
    .populate("ecropdata")
    .exec(function (err, user) {
      if (err) {
        console.log(err);
        res.send("there is a error");
      } else {
        res.render("showland", { farmer: user, ecropname: ecropname });
      }
    });
});

app.listen(3000, function () {
  console.log("server is ON");
});
