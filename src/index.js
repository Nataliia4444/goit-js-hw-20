import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
let page = 1;
async function fetchQuotes(value, page = 1) {
  const API_KEY = '39036273-6668926e4f0bebacaced31faa';
  const q = value;
  const image_type = 'photo';
  const orientation = 'horizontal';
  const safesearch = true;
  const per_page = 40;
  const pages = page;

  const resonse = await axios.get(
    `https://pixabay.com/api/?key=${API_KEY}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&per_page=${per_page}&page=${pages}`
  );
  //!renderMarkup(resonse.data.hits);
  // const response = await link;
  //!console.log(resonse.data.hits);
  // console.log(resonse);
  return resonse.data;
  // return response;
  // .then(response => {
  //   console.log(response);
  //   // renderMarkup(response.data.hits);
  // })
  // .catch(function (error) {
  //   console.log(error);
  // })
  // .finally(function () {
  //   console.log('hi everevan');
  // });
}

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
form.addEventListener('submit', onSubmit);
async function onSubmit(e) {
  e.preventDefault();
  const search = e.target.elements.searchQuery.value;
  const a = await fetchQuotes(search);
  console.log(a.pages);
  renderMarkup(a.hits);
  // console.log(search);
}

function renderMarkup(images) {
  const markup = images
    .map(el => {
      return `<div class="photo-card">
  <a href="${el.largeImageURL}" class='link-img'>
   <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" width='300px' height='200px'/>
</a>

  <div class="info">
    <p class="info-item">
      <b>Likes: ${el.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${el.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${el.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${el.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  const lightbox = new SimpleLightbox('.gallery a', {
    // captions: true,
    // captionsData: 'alt',
    // captionPosition: 'bottom',
    captionDeloy: 250,
  });
  lightbox.on('show.simplelightbox', function (e) {
    e.preventDefault();
  });
}
