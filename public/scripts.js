const itemInput = $('.item-input');
const button = $('.submit-btn');

$(document).ready( async () => {
  console.log('ready');
  const response = await fetch('/api/v1/items')
  const items = await response.json();
  console.log(items);

  items.forEach( item => {
    let checked =  item.packed ? 
      `<span><input class="checkbox "type="checkbox" value="packed" checked> <label>packed</label></span>`:
      `<span><input class="checkbox "type="checkbox" value="packed"> <label>packed</label></span>`
    
    const template = `<article class="card">
                        <h3>${item.item}</h3>
                        <button class="killme">Delete</button>
                        ${checked}
                      </article>`
    $('main').prepend(template)
  })

})

button.click(() => addItem(event))

const addItem = (event) => {
  event.preventDefault();
  const item = itemInput.val();
  if (item === '') {
    console.log('No empty items')
  } else {
    console.log(item)
  }
  itemInput.val('')
}