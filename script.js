// import './data/data.js';
import './js-compound/search-bar.js';
const form = document.querySelector('form');
let inputTitle = document.getElementById('inputjudul');
let inputDesc = document.getElementById('inputdesc');
const loadingIndicator = document.getElementById('loading-indicator');

const customValidationHandler = (event) => {
  event.target.setCustomValidity('');

  if (event.target.validity.valueMissing) {
    event.target.setCustomValidity('Fill this.');
    return;
  }
};

const handleValidation = (event) => {
  const isValid = event.target.validity.valid;
  const errorMessage = event.target.validationMessage;

  const connectedValidationId = event.target.getAttribute('aria-describedby');
  const connectedValidationEl = connectedValidationId
    ? document.getElementById(connectedValidationId)
    : null;

  if (connectedValidationEl) {
    if (errorMessage && !isValid) {
      connectedValidationEl.innerText = errorMessage;
    } else {
      connectedValidationEl.innerText = '';
    }
  }
}

function getTodayDate() {
  const today = new Date();
  const options = { 
      year: 'numeric', 
      month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit'
  };
  const dateString = today.toLocaleDateString('id-ID', {year: 'numeric', month: 'numeric', day: 'numeric' });
  const timeString = today.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  return `${dateString}\n${timeString}`;
}

inputTitle.addEventListener('change', customValidationHandler);
inputTitle.addEventListener('invalid', customValidationHandler);

inputDesc.addEventListener('change', customValidationHandler);
inputDesc.addEventListener('invalid', customValidationHandler);

inputTitle.addEventListener('blur', handleValidation);
inputDesc.addEventListener('blur', handleValidation);

document.addEventListener('DOMContentLoaded', function () {
  const noteList = document.getElementById('note-list');
  const judulInput = document.getElementById('inputjudul');
  const descInput = document.getElementById('inputdesc');
  const btnSubmit = document.getElementById('submit');

  let isLoading = false;

  function loadNotesFromStorage() {
    if (isLoading) {
      return;
    }

    isLoading = true;
    loadingIndicator.style.display = 'block';

    return fetch('https://notes-api.dicoding.dev/v2/notes')
   .then(res => res.json())
   .then(data => {
      notesData = data.notes;
      renderNotes();
    })
   .catch(err => {
      console.error(err);
      alert('Terjadi kesalahan ketika mengambil data catatan');
    })
   .finally(() => {
      isLoading = false;
      loadingIndicator.style.display = 'none';
    });
  }

  loadNotesFromStorage();

  function renderNotes() {
    noteList.innerHTML = '';

    notesData.forEach((note) => {
      const noteElement = createNoteElement(note.title, note.body, note.createdAt);
      noteList.appendChild(noteElement);
    });
  }

  function createNoteElement(title, body, createdAt) {
    const ElementNotesData = document.createElement('div');
    ElementNotesData.classList.add('note-list');
    ElementNotesData.setAttribute('data-title', title);
    ElementNotesData.setAttribute('data-desc', body);

    const ElementNote = document.createElement('note-item');
    ElementNote.setNote({ title, body });

    const elementNote = document.createElement('div');
    elementNote.classList.add('note');

    const titleElement = document.createElement('h2');
    titleElement.textContent = title;

    const bodyElement = document.createElement('p');
    bodyElement.textContent = body;

    const dating = document.createElement('span');
    dating.textContent = formatDate(createdAt);

    elementNote.appendChild(titleElement);
    elementNote.appendChild(bodyElement);
    elementNote.appendChild(dating);

    ElementNotesData.appendChild(ElementNote);

    return ElementNotesData;
  }

  function createNoteDummyElement(noteData) {
    const { title, body, createdAt } = noteData;

    const ElementNote = document.createElement('note-item');
    ElementNote.setNote({ title, body });

    const ElementNotesData =document.createElement('div');
    ElementNotesData.classList.add('note-list');
    ElementNotesData.setAttribute('data-title', title);
    ElementNotesData.setAttribute('data-desc', body);

    const elementNote = document.createElement('div');
    elementNote.classList.add('note');

    const titleElement = document.createElement('h2');
    titleElement.textContent = title;

    const bodyElement = document.createElement('p');
    bodyElement.textContent = body;

    const dating = document.createElement('span');
    dating.textContent = formatDate(createdAt);

    elementNote.appendChild(titleElement);
    elementNote.appendChild(bodyElement);
    elementNote.appendChild(dating);

    ElementNotesData.appendChild(ElementNote);

    return ElementNotesData;
  }function formatDate(dateString) {
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options).replace(',', '');
  }

  function loadNotesFromDummyData() {
    notesData.forEach(note => {
      const noteElement = createNoteDummyElement(note);
      const noteListShadow = noteList.shadowRoot;
      noteListShadow.appendChild(noteElement);
    });
  }
  console.log(notesData);
  loadNotesFromDummyData();

});

class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setNote(note) {
    this.note = note;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
    .note-item {
            display: grid;
            grid-template-areas: 
            'h2'
            'p';
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 10px;
            padding: 10px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            font-size: 30px;
            border-radius: 1em;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
          }

          h2{
            font-size: 30px;
          }

          p{
            font-size: 20px;
          }

          .note-item > div {
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            padding: 20px;

            font-size: 30px;
        }

        .note-item > div h2, .note-item > div p {
            margin: 0;
            font-size: 30px;
        }
        </style>

        <div class="note-item">
          <h2>${this.note.title}</h2>
          <br>
          <p>${this.note.body}</p>

        </div>
      `;
  }
}

class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

}
customElements.define('note-item', NoteItem);
customElements.define('note-list', NoteList);