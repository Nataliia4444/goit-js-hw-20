import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

function fetchQuotes(value) {
  const API_KEY = '39036273-6668926e4f0bebacaced31faa';
  const q = value;
  const image_type = 'photo';
  const orientation = 'horizontal';
  const safesearch = true;

  axios
    .get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}`
    )
    .then(response => {
      renderMarkup(response.data.hits);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      console.log('hi everevan');
    });
}
const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
form.addEventListener('submit', onSubmit);
function onSubmit(e) {
  e.preventDefault();
  const search = e.target.elements.searchQuery.value;
  fetchQuotes(search);
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
  gallery.innerHTML = markup;
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
