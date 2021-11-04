let fs = require("fs");

function Model_builder() {
  let config = fs.readFileSync("configuration.json");

  this.build = function () {
    //generate files and put it into release folder
    //Copy initialize files into release folder
    //TODO

    fs.mkdirSync("./release/models", {
      recursive: true,
    });
    fs.mkdirSync("./release/views", {
      recursive: true,
    });
    fs.mkdirSync("./release/routes", {
      recursive: true,
    });

    const models = JSON.parse(config).model;
    models.map((model) => {
      const fields = model.field;

      //generating routes

      let content = `var express = require("express");
var router = express.Router();
var ${model.name[0].toUpperCase()}${model.name.slice(1)} = require("../models/${
        model.name
      }.model.js");


router.get("/api/${model.name}", async function (req, res, next) {
  try{
    const ${
      model.name
    }s = await ${model.name[0].toUpperCase()}${model.name.slice(1)}.findAll()
    res.status(200).json({
      status:'success',
      ${model.name}s
    })
  }catch(err){
    console.log(err)
  }
});

router.post("/api/${model.name}", async function (req, res, next) {
  try{
    const ${
      model.name
    } = await ${model.name[0].toUpperCase()}${model.name.slice(
        1
      )}.create(req.body)
    res.status(201).json({
      status:'success',
      ${model.name}
    })
  }catch(err){
    console.log(err)
  }
});

module.exports = router;
`;
      fs.writeFile(
        `./release/routes/${model.name}.routes.js`,
        content,
        (err) => {
          if (err) console.log(err);
        }
      );

      //generating views

      content = `<form method="POST" action="/api/${model.name}">
      ${fields.map((field) => {
        return `
        <label>${field[2]}</label>
        <input type="${field[1] === "integer" ? "number" : "text"}" name="${
          field[0]
        }" id="${field[0]}" value="" required=${field[3] === "required"}/>`;
      })}
      <input type="submit" name="submit" id="submit" value="Submit"/>
      </form>
      `;
      fs.writeFile(`./release/views/${model.name}.html`, content, (err) => {
        if (err) console.log(err);
      });

      //generating models

      content = `const Sequelize = require("sequelize");
const sequelize = require("../db");

module.exports = sequelize.define("${model.name}", {
  ${fields.map((field) => {
    return `
   ${field[0]}: {
     type: Sequelize.${field[1].toUpperCase()},
     allowNull: ${field[3] !== "required"},
     autoIncrement: ${field[0] === "id"},
     primaryKey: ${field[0] === "id"},
   }`;
  })}
});`;
      fs.writeFile(
        `./release/models/${model.name}.model.js`,
        content,
        (err) => {
          if (err) console.log(err);
        }
      );
    });
  };

  return this;
}

const model = new Model_builder();
model.build();
