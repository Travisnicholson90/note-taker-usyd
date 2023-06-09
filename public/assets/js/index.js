let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};


const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => response.json())
  .catch((err) => {
    console.error(err);
  });

const saveNote = (note) => {
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  })
  .then((response) => response.json())
  .then((data) => console.log('POST request data', data))
  .catch((error) => {
    console.error(error)
  })
};

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(() => renderNoteList())
  .catch((err) => {
    console.error(err);
  })

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
    console.log('activeNote.id: ', activeNote.id);
    
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
    console.log('nil activeNote.id');
    
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,  
  };

  console.log('newNote: ', newNote);
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
// Delete the clicked note
const handleNoteDelete = (e) => {
  e.stopPropagation();

  const note = e.target;
  
  if (note.classList.contains('delete-note')) {
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

    if (activeNote.id === noteId) {
      activeNote = {};
    }

    deleteNote(noteId).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  }
};


// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  console.log('handle not view');
  
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
    console.log('note saved');
    
  } else {
    show(saveNoteBtn);
    console.log('note not saved');
  }
};

// Render the list of note titles
const renderNoteList = async () => {
  const notes = await getNotes();

  const jsonNotes = notes;
  if (jsonNotes) {
    console.log('jsonNotes valid json', jsonNotes);
  } else {
    console.log('jsonNotes not valid json', jsonNotes);
  }

  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);
    noteListItems.push(li);
  });

  noteListItems.forEach((note) => noteList[0].append(note));
};


// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}
getAndRenderNotes();

