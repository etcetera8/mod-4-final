const itemInput = $('.item-input');
const button = $('.submit-btn');

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