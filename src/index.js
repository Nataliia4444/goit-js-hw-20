// import axios from 'axios';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// let page = 1;
// async function fetchQuotes(value, page = 1) {
//   const API_KEY = '39036273-6668926e4f0bebacaced31faa';
//   const q = value;
//   const image_type = 'photo';
//   const orientation = 'horizontal';
//   const safesearch = true;
//   const per_page = 40;
//   const pages = page;

//   const resonse = await axios.get(
//     `https://pixabay.com/api/?key=${API_KEY}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&per_page=${per_page}&page=${pages}`
//   );
//   //!renderMarkup(resonse.data.hits);
//   // const response = await link;
//   //!console.log(resonse.data.hits);
//   // console.log(resonse);
//   return resonse.data;
//   // return response;
//   // .then(response => {
//   //   console.log(response);
//   //   // renderMarkup(response.data.hits);
//   // })
//   // .catch(function (error) {
//   //   console.log(error);
//   // })
//   // .finally(function () {
//   //   console.log('hi everevan');
//   // });
// }

// const gallery = document.querySelector('.gallery');
// const form = document.querySelector('.search-form');
// form.addEventListener('submit', onSubmit);
// async function onSubmit(e) {
//   e.preventDefault();
//   const search = e.target.elements.searchQuery.value;
//   const a = await fetchQuotes(search);
//   console.log(a.pages);
//   renderMarkup(a.hits);
//   // console.log(search);
// }

// function renderMarkup(images) {
//   const markup = images
//     .map(el => {
//       return `<div class="photo-card">
//   <a href="${el.largeImageURL}" class='link-img'>
//    <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" width='300px' height='200px'/>
// </a>

//   <div class="info">
//     <p class="info-item">
//       <b>Likes: ${el.likes}</b>
//     </p>
//     <p class="info-item">
//       <b>Views: ${el.views}</b>
//     </p>
//     <p class="info-item">
//       <b>Comments: ${el.comments}</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads: ${el.downloads}</b>
//     </p>
//   </div>
// </div>`;
//     })
//     .join('');
//   gallery.insertAdjacentHTML('beforeend', markup);
//   const lightbox = new SimpleLightbox('.gallery a', {
//     // captions: true,
//     // captionsData: 'alt',
//     // captionPosition: 'bottom',
//     captionDeloy: 250,
//   });
//   lightbox.on('show.simplelightbox', function (e) {
//     e.preventDefault();
//   });
// }
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import { fetchImages } from './pixaby-api';
// import { throttle } from 'lodash';

// DOM

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const btn = document.querySelector('#button');

// refs
const refs = {
  failureMessage:
    'Sorry, there are no images matching your search query. Please try again.',
  limitMessage: "We're sorry, but you've reached the end of search results.",
  emptyMessage: "The field can't be empty! Please type at least 1 character",
  errorResponseMessage: 'Something went wrong, please try again later',
  page: 1,
  totalPages: 0,
  LIMIT: 40,
  SCROLL_THROTTLE_INTERVAL: 300,
};

let endOfPageNotified = false; // variable in order to notify "limitMessage" only once

const lightbox = new SimpleLightbox('.gallery a'); // declare lightbox gallery

//Listeners

form.addEventListener('submit', handleSubmit);

btn.addEventListener('click', handleClick);

// handeSubmit function

async function handleSubmit(e) {
  e.preventDefault(); //prevent default actions

  // resetting default values on re-query without reloading page
  refs.page = 1;
  refs.totalPages = 0;
  endOfPageNotified = false;
  //---------------------------------------------------------

  gallery.textContent = ''; // clear markup of the gallery container

  let query = form.searchQuery.value.trim(); // value of input text without superflours spaces

  if (query === '') {
    // check for empty value

    return Notiflix.Notify.failure(refs.emptyMessage);
  }

  try {
    const result = await fetchImages(query, refs.page, refs.LIMIT); // fetch data from pixaby-api

    if (result.hits.length === 0) {
      //Check for empty data
      return Notiflix.Notify.warning(refs.failureMessage);
    }

    refs.totalPages = Math.ceil(result.totalHits / refs.LIMIT); // Count total pages

    // if (refs.totalPages <= refs.page && result.hits.length > 0) {
    //   // Check for the last page

    //   return Notiflix.Notify.failure(refs.limitMessage);
    // }

    renderMarkup(result.hits); // Call the function to render markup

    let newLightbox = new SimpleLightbox('.gallery a'); // create new gallery
    newLightbox.refresh();
    Notiflix.Notify.info(`Hooray! We found ${result.totalHits} images.`); // Send a notify with found image qty
  } catch (error) {
    // Catch an error

    Notiflix.Notify.failure(refs.errorResponseMessage);
  }
}
//-----------------------------------------------
function renderMarkup(images) {
  // Render markup

  const markup = images.reduce(
    (
      html,
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) => {
      return (
        html +
        ` 
         <div class="photo-card">
         <a class="gallery__link" href="${largeImageURL}">
         <img src="${webformatURL}" alt="${tags}" width="300px" loading="lazy" />
         </a>
         <div class="info">
           <div class="info-item">
             <p>Likes</p>
             <p>${likes}</p>
           </div>
           <div class="info-item">
             <p>Views</p>
             <p>${views}</p>
           </div>
           <div class="info-item">
             <p>Comments</p>
             <p>${comments}</p>
           </div>
           <div class="info-item">
             <p>Downloads</p>
             <p>${downloads}</p>
           </div>
         </div>
       </div>
       `
      );
    },
    ''
  );

  gallery.insertAdjacentHTML('beforeend', markup); // Insert a markup in the index.html file

  lightbox.refresh(); // refresh lightbox
}
//----------------------------------------------

function loadMoreHandler() {
  // Check if the user has reached the bottom of the page
  if (distanceToBottom < 200) {
    if (refs.page < refs.totalPages) {
      // Check if there are more pages to load
      refs.page += 1;

      fetchAndRenderImages();
    } else {
      if (!endOfPageNotified) {
        limitNotify();
      }
    }
  }
}

async function fetchAndRenderImages() {
  try {
    const result = await fetchImages(
      form.searchQuery.value,
      refs.page,
      refs.LIMIT
    );
    renderMarkup(result.hits);
  } catch (error) {
    Notiflix.Notify.failure(refs.errorResponseMessage);
  }
}
//-----------------------------------------------

function handleButtonVisibility() {
  // Handle visiblity "to top" button

  btn.classList.toggle('show', window.scrollY > 300);
}

//----------------------------------------------

function handleClick(e) {
  // Handle click on the "to top" button

  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '38590666-b4e4facc0390580085af70521';

axios.defaults.baseURL = 'https://pixabay.com/api/';

async function fetchImages(searchQuery, page, limit) {
  const response = await axios(
    `?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${limit}`
  );
  return response.data;
}
