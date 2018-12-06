const request = require("request");
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("./test/mockData.json");
const middlewares = jsonServer.defaults({ bodyParser: true });
const port = 8080;

server.use(middlewares);

server.use(jsonServer.bodyParser);

server.get("/getParts", (req, res, next) => {
  const url = `http://localhost:${port}/parts?partNbr_like=${
    req.query.partNbr
  }`;
  if (req.query.partNbr == "mockError") {
    res.status(500).send("Server Internal Error");
  } else {
    request({ url: url, json: true }, (err, response, body) => {
      if (body.length > 0) {
        res.send(body);
      } else {
        res.status(204).send("No parts found");
      }
    });
  }
}); // get(/getParts)

server.post("/ssoLogin", (req, res, next) => {
  if (req.body.j_username) {
    const url = `http://localhost:${port}/users?username_like=${
      req.body.j_username
    }`;
    request({ url: url, json: true }, (err, response, body) => {
      if (body.length > 0) {
        res.status(200).send(body[0]);
      } else {
        res.status(401).send("Sorry, cant find that");
      }
    });
  } else {
    res.status(500).send("No username entered");
  }
}); // post(/ssoLogin)

server.get("/getUserProfile", (req, res, next) => {
  if (req.query.username) {
    const url = `http://localhost:${port}/users?username_like=${
      req.query.username
    }`;
    request({ url: url, json: true }, (err, response, body) => {
      if (body.length > 0) {
        res.status(200).send(body[0]);
      } else {
        res.status(401).send("Sorry, cant find that");
      }
    });
  } else {
    res.status(500).send("No username entered");
  }
}); // post(/getUserProfile)

const getRandomNumber = max => Math.floor(Math.random() * Math.floor(max));

server.post("/partsOrders", (req, res, next) => {
  if (req.body.parts.length > 0) {
    if (req.body.parts[0].partNbr === "330-0070") {
      res.status(404).send("Purchase order service is down");
    } else {
      const url = `http://localhost:${port}/storedPartsOrders`;
      const body = req.body;

      const partsDetails = [];
      body.parts.forEach(part => {
      const newPart = {
          partNbr: part.partNbr,
          quantity: part.orderQuantity,
          partDescription: part.partDescription,
          brandName: part.brandName,
          purchaseOrderStatDesc: "SUBMITTED",
          purchaseOrderNbr: `${body.locationNbr}7${getRandomNumber(9999)}`
        };
        partsDetails.push(newPart);
      });

      const data = {
        orderCreatedDate: body.orderDate,
        workOrderNbr: body.workOrderNbr,
        partsOrderId: getRandomNumber(9999999999),
        partsDetails: partsDetails,
        locationNbr: body.locationNbr
      };

      request.post({ url: url, json: true, body: data },
        (err, response, body) => {
          if (response.statusCode === 201) {
            res.status(200).send("Purchase order created");
          } else {
            res.status(response.statusCode).send("Error creating purchase order");
          }
        }
      );
    }
  } else {
    res.status(400).send("Bad purchase order");
  }
}); // post(/createPurchaseOrder)

server.get("/partsOrders", (req, res, next) => {

  const url = `http://localhost:${port}/storedPartsOrders?locationNbr=${req.query.locationNbr}&_sort=id&_order=desc`;

  request.get({ url: url, json: true },  (err, response, body) => {
    console.log(body);
    if (response.statusCode !== 500) {
      res.status(200).send(body);
    } else {
      res.status(500).send("Error getting parts orders");
    }
  });
}); // get(/partsOrders)

server.get("/partsOrder/openPurchaseOrders", (req, res, next) => {
  
  const url = `http://localhost:${port}/storedOpenPurchaseOrders?locationNbr=${req.query.locationNbr}&_sort=id&_order=asc`;

  request.get({ url: url, json: true },  (err, response, body) => {
    console.log(body);
    if (response.statusCode !== 500) {
      res.status(200).send(body);
    } else {
      res.status(500).send("Error getting open purchase orders");
    }
  });
}); // get(/partsOrder/openPurchaseOrders)

server.get("/partsInventory", (req, res, next) => {

  const url = `http://localhost:${port}/storedInventory?storeNbr=${req.query.storeNbr}`;
  
  request.get({ url: url, json: true },  (err, response, body) => {
    // console.log(body);
    if (response.statusCode !== 500) {
      res.status(200).send(body);
    } else {
      res.status(500).send("Error getting parts orders");
    }
  });
}); // get(/partsInventory)

server.post("/partsInventory", (req, res, next) =>{
  if (req.body.partsInventoryDTOs.length > 0) {
      const url = `http://localhost:${port}/storedInventory`;
      const data = req.body.partsInventoryDTOs[0];

      request.post({ url: url, json: true, body: data },
        (err, response, body) => {
          if (response.statusCode === 201) {
            res.status(200).send("Added Part to Inventory Succesfully.");
          } else {
            res.status(response.statusCode).send("Error in adding parts to inventory.");
          }
        }
      );
  } else {
    res.status(400).send("Bad Parts Inventory request");
  }
});

server.post("/updateReceivePartOrder", (req, res, next) =>{
  if (req.body.partsDetails.length > 0) {
    if (req.body.partsDetails[0].partNbr === "310-0101") {
      res.status(200).send(req.body);     
    }else{
      res.status(500).send("updateReceivePartOrder failed");
    }    
  }
  else{
    res.status(500).send("Internal Error");
  }

  // console.log("$$$$$$$ calling mock updateReceivePartOrder ", req.body);
  // if (req.body.partsDetails.length > 0) {
  //     const url = `http://localhost:${port}/updateReceivePartOrder`;
  //     const data = req.body;
  //     request.post({ url: url, json: true, body: data },
  //       (err, response, body) => {
  //         res.status(200).send(body);
  //       }
  //     );
  // } else {
  //   res.status(400).send("Bad updateReceivePartOrder request");
  // }
});

server.put("/partsInventory", (req, res, next) => {
  const updatedPart = req.body;
  let storedPart;

  const getUrl = `http://localhost:${port}/storedInventory?storeNbr=${updatedPart.storeNbr}&partNbr=${updatedPart.partNbr}&brandNbr=${updatedPart.brandNbr}`;
  request.get({ url: getUrl, json: true}, (err, response, body) => {
    storedPart = body[0];
    const putUrl = `http://localhost:${port}/storedInventory/${storedPart.id}`
    request.put({ url: putUrl, json: true, body: updatedPart },  (err, response, body) => {
      if (response.statusCode !== 500) {
        res.status(200).send(body);
      } else {
        res.status(500).send("Error getting parts orders");
      }
    });
  });
}); // put(/partsInventory)


server.get('/getPurchaseOrders', function(req, res){
  const url = `http://localhost:${port}/storedOpenPurchaseOrders?locationNbr=${req.query.locationNbr}&_sort=id&_order=desc`;

  request.get({ url: url, json: true },  (err, response, body) => {
    if (response.statusCode !== 500) {
      res.status(200).send(body);
    } else {
      res.status(500).send("Error getting parts orders");
    }
  });
}); // get(/getPurchaseOrders)

server.use(router);

server.listen(port, () => {
  console.log(`MockApi is running on http://localhost:${port}`);
});
