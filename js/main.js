//Example fetch using pokemonapi.co
// document.querySelector('button').addEventListener('click', getFetch)

function getFetch(userInput){
  // const choice = document.querySelector('input').value
  let inputVal = document.getElementById("barcode").value

  if( inputVal.length !== 12) {
    alert(`Please ensure that barcode is 12 characters`)
    return;
  }
  const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => { //use JSON data
        console.log(data)
        if (data.status === 1) {
          //call additional stuff
          const item = new ProductInfo(data.product)
          item.showInfo()
          item.listIngredients()
        } else if (data.status === 0) {
          alert(`Product ${inputVal} not found. Please try another.`)
        }
        }
      )
      .catch(err => {
          console.log(`error ${err}`)
      });
    }

    class ProductInfo {
      constructor(productData) { //I am passing in data.product
        this.name = productData.product_name
        this.ingredients = productData.ingredients
        this.image = productData.image_url
      }

      showInfo() {
        document.getElementById('product-img').src = this.image
        document.getElementById('product-name').innerText = this.name
      }

      listIngredients() {
        let tableRef = document.getElementById('ingredient-table')
        
        //loop thru each row skipping first one, looping thru remaining row (skipping the header) -- keeps deleting rows until there is only one left
        for (let i = 1; i < tableRef.rows.length;){ 
          tableRef.deleteRow(i);
        }

        for( let key in this.ingredients) {
          let newRow = tableRef.insertRow(-1) // this adds a row  to the end of table
          let newICell = newRow.insertCell(0) // this is for the Ingredient row
          let newVCell = newRow.insertCell(1) // this is for the Vegetarian row
          let newIText = document.createTextNode(
            this.ingredients[key].text // this is the property under ingredients that we are trying to grab
          )
          let vegStatus = !(this.ingredients[key].vegetarian) ? 'unknown' : this.ingredients[key].vegetarian // this is an if statement that outputs 'unknown' if the value of vegetarian is falsey. Because it is truthy, then it will output the value
          
          let newVText = document.createTextNode(vegStatus)
          newICell.appendChild(newIText) // this puts the text into the cell
          newVCell.appendChild(newVText) // this puts the text into the cell

          if (vegStatus === 'no') {
            //turn item red
            newVCell.classList.add('non-veg-item')

          } else if (vegStatus === 'unknown' || vegStatus === 'maybe'){
            //turn item yellow
            newVCell.classList.add('unknown-maybe-item')
          }
        }
      }
    }