const gridElem = document.querySelector(".grid");
let myValues = [];

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

fetch("compiled_data.json")
  .then((response) => response.json())
  .then((data) => {
    let innerHTML = "";
    let index = 0;
    for (let entry in data[0].dimensions) {
      let value = data[0].dimensions[entry].scores["2024"];
      let name = data[0].dimensions[entry].key;

      //console.log(data[1].dimensions[0].subdimensions[entry].score);
      let fullTitle = dimensionTitleMap[name] || name;

      let countries = ["ALB", "BIH", "KOS", "MNE", "MKD", "SRB"];
      let colors = ["91C682", "5CACE0", "F76C4D", "CA8CE0", "FF9549", "FDEF7A"];

      let values = countries.map(
        (country, index) => data[index + 1].dimensions[0].scores["2024"]
      );

      let subdimensionsHTMLALB = "";
      let TiteldimensionsHTMLALB = "";


      if (entry % 3 === 0) {
        innerHTML += "<div class='subgrid'>";
        console.log("schmeiss das subgrid rein");
      }

      let linkDIM = `${name.substring(0, 3)}_DIM.html`;

     

      innerHTML += `<a class='title' href="UnderSites/${linkDIM}" target="_blank">`;
      innerHTML += `<div class='item ${name}' style='height: calc(${value} * 9%);'>`;
     innerHTML += `<div class='title'>${fullTitle} ${value}</div>`;
      

      // Füge die inneren Elemente für jedes Land hinzu
      countries.forEach((country, i) => {
        // Initialisiere HTML für Subdimension

        subdimensionsHTMLALB = "";
        data[i + 1].dimensions[index].subdimensions.forEach(
          (subdim, subIndex) => {
            let indicatorsHTMLALB = "";
            let subdimScore = subdim.score;

            // Schleife über die Indikatoren der Subdimension
            subdim.indicators.forEach((indicator, indIndex) => {
              let indicatorScore = indicator.score;
              indicatorsHTMLALB +=
                "<div class='indicator-item' style='height: calc(" +
                indicatorScore +
                " * 4.9%);'></div>";
            });

            // Füge die Subdimension und ihre Indikatoren zum HTML hinzu
            subdimensionsHTMLALB +=
              "<div class='subdim-item' style='height: calc(" +
              subdimScore +
              " * 20%);'> " +
              indicatorsHTMLALB +
              "</div>";
          }
        );

        let country_per_dimension_score =
          data[i + 1].dimensions[index].scores["2024"];

          let link = `${name.substring(0, 3).toUpperCase()}_${country}.html`;

  
          innerHTML += `
          <a href="UnderSites/${link}" target="_blank"> 
            <div class='inner-item' style='height: calc(${country_per_dimension_score} * 20%); background-color: ${colors[i]};'>
              <div class='inner-title'> ${country_per_dimension_score}</div>
              <div class='inner-item-sub inner-item-sub-${country}'>${subdimensionsHTMLALB}</div>
            </div>
          </a>`;
      });

      innerHTML += "</div>";

      if (entry % 3 === 2) {
        innerHTML += "</div>";
        console.log("schliesse das subgrid rein");
      }
      index++;
    }

    gridElem.innerHTML = innerHTML;
  })

  .catch((error) => {
    console.error("Fehler beim Laden der JSON-Datei:", error);
  });
