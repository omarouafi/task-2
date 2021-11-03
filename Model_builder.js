let fs = require("fs");

function Model_builder() {
  let config = fs.readFileSync("configuration.json");

  this.build = function () {
    //generate files and put it into release folder
    //Copy initialize files into release folder
    //TODO
    fs.mkdirSync("./release", {
      recursive: true,
    });

    const models = JSON.parse(config).model;
    models.map((model) => {
      const fields = model.field;
      const content = `<form method="POST" action="/api/${model.name}">
      ${fields.map((field) => {
        return `
        <label>${field[2]}</label>
        <input type="${field[1] === "integer" ? "number" : "text"}" name="${
          field[0]
        }" id="${field[0]}" value="" required=${field[3] === "required"}/>`;
      })}
      <input type="submit" name="submit" id="submit" value="Submit"/>
      </form>;
      `;
      fs.writeFile(`./release/${model.name}.html`, content, (err) => {
        if (err) console.log(err);
      });
    });
  };

  return this;
}

const model = new Model_builder();
model.build();
