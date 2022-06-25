const searchItems = document.getElementsByClassName('result');
const bookmarkTabIcon = document.getElementById('bookmark-tab-icon');
const bookmarkTab = document.getElementById('map-bookmarks');


bookmarkTabIcon.addEventListener('click', () => {
  bookmarkTab.classList.toggle('visible');
})

// console.log(searchItems);
let searchItemsArr = [...searchItems];
console.log(searchItemsArr);

for (let i = 0; i < searchItemsArr.length; i++) { 
  // console.log(searchItems[i]); 
  console.log(i);
}
