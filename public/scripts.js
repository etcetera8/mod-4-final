const itemInput = $('.item-input');
const button = $('.submit-btn');

$(document).ready(() => loadList())
button.click(() => addItem(event))
$('main').on('click', '.checkbox', (event) => updatePacked(event))
$('main').on('click', '.killme', (event) => deleteCard(event))

const loadList = async() => {
  const response = await fetch('/api/v1/items')
  const items = await response.json();
  makeTemplate(items)
}

const makeTemplate = (items) => {
  items.forEach(item => {
    let checked = item.packed ?
      `<span><input class="checkbox "type="checkbox" value="${item.id}" checked> <label>packed</label></span>` :
      `<span><input class="checkbox "type="checkbox" value="${item.id}"> <label>packed</label></span>`

    const template = `<article class="card">
                        <h3>${item.item}</h3>
                        <button class="killme" value=${item.id} onClick=deleteItem(${item.id})>Delete</button>
                        ${checked}
                      </article>`
    $('main').prepend(template)
  })
}

const deleteCard = (event) => {
  $(this.event.target).closest('article.card').remove();
}

const updatePacked = (event) => {
  const { value } = event.target;
  if (event.target.hasAttribute('checked')) {
    event.target.removeAttribute('checked')
  } else {
    event.target.setAttribute('checked', true)
  }

  const checked = event.target.hasAttribute('checked')
  fetch(`/api/v1/items/${value}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      packed: checked
    })
  })
}

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

const addItem = async (event) => {
  event.preventDefault();
  const item = itemInput.val();
  if (item === '') {
    console.log('No empty items')
  } else {
    await postItem(item)
  }
  itemInput.val('')
  location.reload();
  await loadList();
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
    console.log("these are the results", results)
  })
  .catch( error => {
    console.log('request failed', error);
  })
}