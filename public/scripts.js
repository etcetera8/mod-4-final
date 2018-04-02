const itemInput = $('.item-input');
const button = $('.submit-btn');

$(document).ready( async () => {
  const response = await fetch('/api/v1/items')
  const items = await response.json();

  items.forEach( item => {
    console.log(item);
    let checked =  item.packed ? 
      `<span><input class="checkbox "type="checkbox" value="packed" checked> <label>packed</label></span>`:
      `<span><input class="checkbox "type="checkbox" value="packed"> <label>packed</label></span>`
    
    const template = `<article class="card">
                        <h3>${item.item}</h3>
                        <button class="killme" value=${item.id} onClick=deleteItem(${item.id})>Delete</button>
                        ${checked}
                      </article>`
    $('main').prepend(template)
  })

})

button.click(() => addItem(event))

const deleteItem = (itemId) => {
  fetch(`/api/v1/items/${itemId}`, {
    method: 'DELETE'
  }).then(response => { 
    return response.json()
  })
  .catch(error => {
    console.log("error", error);
  })
}

const addItem = (event) => {
  event.preventDefault();
  const item = itemInput.val();
  if (item === '') {
    console.log('No empty items')
  } else {
    postItem(item)
  }
  itemInput.val('')
}

const postItem = (item) => {
  fetch('/api/v1/items', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'    
    },
    body: JSON.stringify({
      item
    })
  })
  .then( response => {
    return response.json()
  })
  .then ( results => {
    console.log("these are the results", results.item[0])
  })
  .catch( error => {
    console.log('request failed', error);
  })
}