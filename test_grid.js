const gridElem = document.querySelector(".grid");
let myValues = [];
let state = 0;

const dimensionTitleMap = {
  INNOVATION: "Science, Technology and Innovation",
  INVESTMENT: "Investment Policy and Promotion",
  TRADE: "Trade Policy",
  FINANCE: "Access to Finance",
  TAX: "Tax Policy",
  ENTERPRISE: "State-owned Enterprises",
  ANTI_CORRUPTION: "Anti-corruption Policy",
  EDUCATION: "Education Policy",
  EMPLOYMENT: "Employment Policy",
  DIGITAL: "Digital Society",
  TRANSPORT: "Transport Policy",
  ENERGY: "Energy Policy",
  ENVIRONMENT: "Environment Policy",
  AGRICULTURE: "Agriculture Policy",
  TOURISM: "Tourism Policy",
};

Promise.all([
  fetch("compiled_data.json").then((response) => response.json()),
  fetch("data/subdimension_text.json").then((response) => response.json())
]).then(([compiledData, subdimensionText]) => {
  let innerHTML = "";
  let index = 0;
  console.log(subdimensionText)
  for (let entry in compiledData[0].dimensions) {
    let value = compiledData[0].dimensions[entry].scores["2024"];
    let name = compiledData[0].dimensions[entry].key;

    let fullTitle = dimensionTitleMap[name] || name;

    let countries = ["ALB", "BIH", "KOS", "MNE", "MKD", "SRB"];
    let colors = ["91C682", "5CACE0", "F76C4D", "CA8CE0", "FF9549", "FDEF7A"];

    let subdimensionsHTMLALB = "";

    if (entry % 3 === 0) {
      innerHTML += "<div class='subgrid'>";
      console.log("schmeiss das subgrid rein");
    }

    innerHTML += `<div class='item ${name}' id='${index + 1}' style='height: calc(${value} * 9%);'>`;
    innerHTML += `<div class='title'>${fullTitle} ${value}</div>`;


    countries.forEach((country, i) => {

      subdimensionsHTMLALB = "";
      compiledData[i + 1].dimensions[index].subdimensions.forEach(
        (subdim, subIndex) => {
          let indicatorsHTMLALB = "";
          let subdimScore = subdim.score;

          subdim.indicators.forEach((indicator, indIndex) => {
            let indicatorScore = indicator.score;
            indicatorsHTMLALB +=
              "<div class='indicator-item' style='height:100%'></div>";
          });


          subdimensionsHTMLALB +=
            "<div class='subdim-item' style='height: calc(" +
            subdimScore +
            " * 20%);'> " +
            indicatorsHTMLALB +
            "</div>";
        }
      );

      let country_per_dimension_score =
        compiledData[i + 1].dimensions[index].scores["2024"];

      innerHTML += `
            <div class='inner-item' style='height: calc(${country_per_dimension_score} * 20%); background-color: ${colors[i]};'>
              <div class='inner-title'> ${country_per_dimension_score}</div>
              <div class='inner-item-sub inner-item-sub-${country}'>${subdimensionsHTMLALB}</div>
            </div> `;
    });

    innerHTML += "</div>";

    if (entry % 3 === 2) {
      innerHTML += "</div>";
      console.log("schliesse das subgrid rein");
    }

    index++;
  }



  // Fügen Sie den Titel der Subdimensionen als verstecktes Element hinzu
  subdimensionText.forEach((dimension) => {
    const dimensionNumber = dimension.name.replace(/\D/g, ''); // Entfernt alle nicht-numerischen Zeichen
    innerHTML += `<div class='hidden dim-title subdimension-title-${dimensionNumber}'><span class='title-bold'>${dimension.title}</span>
     <br>  <br> ${dimension.text}</div>`;
  });


  gridElem.innerHTML = innerHTML;

  document.querySelector(".overview").addEventListener("click", (e) => {
    console.log("overview click", document.querySelectorAll(".item"));

    document.querySelectorAll(".item").forEach((item) => {
     // console.log("---item",item);
      item.classList.remove("active");
      item.classList.remove("non-active");
      item.classList.remove("newItem");
    item.classList.add("item");
    });

    document.querySelectorAll(".newItem").forEach((item) => {
      // console.log("---item",item);

       item.classList.remove("active");
       item.classList.remove("non-active");
       item.classList.remove("newItem");
       item.querySelector(".inner-item").classList.remove("active");
     item.classList.add("item");
     });

    document.querySelectorAll(".subgrid").forEach((subgrid) => {
      subgrid.classList.remove("hidden");
     
    });

    document.querySelectorAll(".title").forEach((subTitle) => {
      subTitle.classList.remove("hidden");
    });

    document.querySelectorAll('.dim-title').forEach((title) => {
      title.classList.remove("show");
    });

    document.querySelectorAll('.inner-Item').forEach((innerItem) => {
      innerItem.classList.remove("hidden");
      innerItem.classList.remove("non-active");

    });
    state = 0;

    document.querySelector(".grid").classList.remove("grid-changed");

  });



  // JavaScript
  document.querySelectorAll(".item").forEach((item) => {
    item.addEventListener("click", (e) => {
      console.log(e.target);

      // Blenden Sie alle Subgrids aus
      document.querySelectorAll(".subgrid").forEach((subgrid) => {
        subgrid.classList.add("hidden");
      });

      // Finden Sie das Subgrid des angeklickten Elements und blenden Sie es ein
      const subgrid = e.target.closest(".subgrid");
      if (subgrid) {
        subgrid.classList.remove("hidden");
      }

      document.querySelectorAll(".item").forEach((item) => {
        item.classList.add("non-active");
      });

      // Extrahieren Sie die ID des Eltern-Elements
      const parentID = e.target.closest(".item").id;
      console.log("parent id",parentID);

      // Fügen Sie die Klasse zum Element mit der ID hinzu
      document.querySelector(".subdimension-title-" + parentID).classList.add("show");

      state = 1;
      item.classList.remove("non-active");
      item.classList.add("active");

      // Ändern Sie die Struktur des Grids
      document.querySelector(".grid").classList.add("grid-changed");
    });
  });



  // // DIM Länder

  document.querySelectorAll(".inner-item").forEach((innerItem) => {
    innerItem.addEventListener("click", (d) => {
      console.log(d.target);

      // Alle Items und inner-items inaktiv und versteckt machen
      document.querySelectorAll(".item").forEach((item) => {
        item.classList.remove("item");
        item.classList.add("newItem");
      });

      document.querySelectorAll(".inner-item").forEach((innerItem) => {
        innerItem.classList.add("non-active");
        innerItem.classList.add("hidden");
      });


      document.querySelectorAll('.title').forEach((subTitle) => {
        subTitle.classList.add("hidden");
      });

      // Nur das angeklickte inner-item sichtbar und aktiv machen
      innerItem.classList.remove("non-active");
      innerItem.classList.remove("hidden");
      innerItem.classList.add("active");

      // Das Grid entsprechend ändern
      document.querySelector(".grid").classList.add("grid-changed");

    });
  });






})
  .catch((error) => {
    console.error("Fehler beim Laden der JSON-Datei:", error);
  });
