// ELEMENT /////////////////////////////////////
let body = document.querySelector('body')

let themeButton = document.querySelector('#theme-container')

//WRITE-SECTION
let writeSection = document.querySelector('#section-write')
let writePanel = document.querySelector('#write-panel')

let welcomePanel = document.querySelector('#welcome-panel')
let welcomeTextContainer = document.querySelector('#welcome-text-container')

let writeOptions = document.querySelector('#write-options')

let labelWrite = document.querySelector('#write-label')
let noteInput = document.querySelector('#write-input')
let noteButtonAdd = document.querySelector('#write-button-add')
let noteButtonEdit = document.querySelector('#write-button-edit')
let noteButtonCancelEdit = document.querySelector('#write-button-cancel')

//READ-SECTION
let readSection = document.querySelector('#section-read')
let readOptionsSort = document.querySelector('#read-options-sort')
let noteList = document.querySelector('#read-notes-list')

// IMPORTANTES /////////////////////////////////////

let currentVersion = 1.3
let noteIdEdit //어떤 노트가 편집되고 있는지 확인하는 데 사용
let editMode = false

///////////////////////////////////////////////////////////////

//초기화 //////////////////////////////////////////////

let noteousMain = JSON.parse(localStorage.getItem('noteous-main')) || []
let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))

getSettings()
renderNote()
showWelcome()

/////////////////////////////////////////////////////////////

//welcome
function welcomeToNoteous(context) {
  setTheme('setThemeLight')
  //context --> prime
  if (context == 'first-access') {
    //Config (note 1.0)

    //Panel Section
    //greetingPanel --> sectionMain + sectionTitle
    let greetingPanel = document.createElement('div')
    greetingPanel.classList.add('greeting-panel')

    let greetingSectionMain = document.createElement('div')
    greetingSectionMain.classList.add('greeting-section-main')

    let greetingSectionTitle = document.createElement('div')
    greetingSectionTitle.classList.add('greeting-section-title')

    //Next Button
    btnNext = document.createElement('button')
    btnNext.classList.add('write-buttons')
    btnNext.appendChild(document.createTextNode('Atualizar noteous'))
    btnNext.addEventListener('click', () => {
      document.location.reload()
    })

    //Appends
    greetingSectionMain.append(
      greetingTitle1,
      greetingTitle1b,
      greetingSectionTitle,
      greetingDescriptionTitle,
      greetingDescriptionUl,
      btnNext
    )
    greetingPanel.append(greetingSectionMain)
    body.innerHTML = ''
    body.append(greetingPanel)
  }
}

// CONFIG TEMA ////////////////////////////////////
function setTheme(context) {
  //context => recuperar tema, trocar tema, aplicar tema claro, aplicar tema escuro
  if (context == 'retrieveTheme') {
    if (noteousSettings.theme.themeLum == 'light') {
      setTheme('setThemeLight')
      console.log(context)
    } else if (noteousSettings.theme.themeLum == 'dark') {
      setTheme('setThemeDark')
    }
  } else if (context == 'changeTheme') {
    console.log(context)
    if (noteousSettings.theme.themeLum == 'light') {
      setTheme('setThemeDark')
    } else if (noteousSettings.theme.themeLum == 'dark') {
      setTheme('setThemeLight')
    }
  } else if (context == 'setThemeLight') {
    console.log(context)
    noteousSettings.theme = themeParams = {
      themeLum: 'light',
      hue: '--hue: 30;',
      str: '--str: 90%;',
      lumBack: '--lum-back: 90%;',
      lumMid: '--lum-mid: 60%;',
      lumFront: '--lum-front: 10%;'
    }

    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
    document.querySelector(
      ':root'
    ).style.cssText = `${noteousSettings.theme.hue} ${noteousSettings.theme.str}
${noteousSettings.theme.lumBack}
${noteousSettings.theme.lumMid}
${noteousSettings.theme.lumFront}`
  } else if (context == 'setThemeDark') {
    noteousSettings.theme = themeParams = {
      themeLum: 'dark',
      hue: '--hue: 30;',
      str: '--str: 40%;',
      lumBack: '--lum-back: 10%;',
      lumMid: '--lum-mid: 30%;',
      lumFront: '--lum-front: 90%;'
    }

    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
    document.querySelector(
      ':root'
    ).style.cssText = `${noteousSettings.theme.hue} ${noteousSettings.theme.str}
${noteousSettings.theme.lumBack}
${noteousSettings.theme.lumMid}
${noteousSettings.theme.lumFront}`
  }
}

themeButton.addEventListener('click', () => {
  setTheme('changeTheme')
})

//기능 /////////////////////////////////////

//GETSETTINGS --> 페이지 새로고침 시 저장된 데이터 복구
function getSettings() {
  //엑세스 --> 데이터 복구
  if (noteousSettings != null) {
    if (noteousSettings.noteousVersion != currentVersion) {
      //VERIFY
      noteousSettings = {
        noteousVersion: currentVersion,
        sort: 'recent',
        priority: 'solid'
      }
      welcomeToNoteous('new-version')
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else {
      //SE

      //Aplica 
      sortNotes('retrieveSort')
      //Aplica
      setTheme('retrieveTheme')
    }
  } else if (noteousSettings == null) {
    //CONFIG--> PRIME ACESS
    noteousSettings = {
      noteousVersion: currentVersion,
      sort: 'recent',
      priority: 'solid'
    }
    welcomeToNoteous('first-access')
    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  }
}

//
function showWelcome() {
  let dateNow = new Date()
  let welcomeText = document.createTextNode(
    `안녕! 오늘은 ${findWeek(new Date(dateNow).getDay())}, ${findMonth(new Date(dateNow).getMonth())} ${new Date(dateNow).getDate()} 일`
  )
  welcomeTextContainer.append(welcomeText)
}

//DATA
// carreg, Define priorid = solid, configuration
noteousSettings.priority = 'solid'
localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
notePriority('retrievePriority', noteousSettings.priority)

function notePriority(context, priority) {
  //context ==> priori
  if (context == 'retrievePriority') {
    if (priority == 'solid') {
      writeOptions.style.cssText = 'border-style: solid;'
      noteInput.style.cssText = 'border-style: solid;'
      noteousSettings.priority = 'solid'
    } else if (priority == 'double') {
      writeOptions.style.cssText = 'border-style: double;'
      noteInput.style.cssText = 'border-style: double;'
      noteousSettings.priority = 'double'
    } else if (priority == 'dotted') {
      writeOptions.style.cssText = 'border-style: dotted;'
      noteInput.style.cssText = 'border-style: dotted;'
      noteousSettings.priority = 'dotted'
    }
  } else if (context == 'retrievePriorityBlurInput') {
    if (priority == 'solid') {
      writeOptions.style.cssText = 'border-style: solid; opacity: 0'
    } else if (priority == 'double') {
      writeOptions.style.cssText = 'border-style: double;  opacity: 0'
    } else if (priority == 'dotted') {
      writeOptions.style.cssText = 'border-style: dotted;  opacity: 0'
    }
  } else if (context == 'changePriority') {
    if (priority == 'solid') {
      writeOptions.style.cssText = 'border-style: double;'
      noteInput.style.cssText = 'border-style: double;'
      noteousSettings.priority = 'double'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else if (priority == 'double') {
      writeOptions.style.cssText = 'border-style: dotted;'
      noteInput.style.cssText = 'border-style: dotted;'
      noteousSettings.priority = 'dotted'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else if (priority == 'dotted') {
      writeOptions.style.cssText = 'border-style: solid;'
      noteInput.style.cssText = 'border-style: solid;'
      noteousSettings.priority = 'solid'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    }
  }
}

noteInput.addEventListener('focus', () => {
  if (editMode == false) {
    notePriority('retrievePriority', noteousSettings.priority)
  }
})

noteInput.addEventListener('blur', () => {
  if (editMode == false) {
    notePriority('retrievePriorityBlurInput', noteousSettings.priority)
  }
})

writeOptions.addEventListener('click', () => {
  noteInput.focus()
  notePriority('changePriority', noteousSettings.priority)
})

// 정렬기준
function sortNotes(context) {
  if (context == 'retrieveSort') {
    if (noteousSettings.sort == 'recent') {
      noteList.style.cssText = 'flex-wrap: wrap; flex-direction: row;'

      readOptionsSort.innerHTML = ''
      readOptionsSort.append(
        document.createTextNode('정렬기준: 최근')
      )
    } else if (noteousSettings.sort == 'old') {
      noteList.style.cssText =
        'flex-wrap: wrap-reverse; flex-direction: row-reverse;'

      readOptionsSort.innerHTML = ''
      readOptionsSort.append(
        document.createTextNode('정렬기준: 과거')
      )
    }
  } else {
    if (noteousSettings.sort == 'recent') {
      noteList.style.cssText =
        'flex-wrap: wrap-reverse; flex-direction: row-reverse;'

      readOptionsSort.innerHTML = ''
      readOptionsSort.append(
        document.createTextNode('정렬기준: 과거')
      )
      noteousSettings.sort = 'old'
      renderNote()
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else if (noteousSettings.sort == 'old') {
      noteList.style.cssText = 'flex-wrap: wrap; flex-direction: row;'

      readOptionsSort.innerHTML = ''
      readOptionsSort.append(
        document.createTextNode('정렬기준: 최근')
      )
      noteousSettings.sort = 'recent'
      renderNote()
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    }
  }
}

readOptionsSort.addEventListener('click', sortNotes)

//
function renderNote() {
  noteList.innerHTML = ''

  for (let note of noteousMain) {
    let noteContainer = document.createElement('div')
    noteContainer.classList.add('note-container')

    //메모지 순서
    if (note.priority == 'solid') {
      noteContainer.style.cssText = 'border-style: none;'
    } else if (note.priority == 'double') {
      noteContainer.style.cssText = 'border-style: double;'
    } else if (note.priority == 'dotted') {
      noteContainer.style.cssText = 'border-style: dotted;'
    }

    //ACTION BUTTONS
    let actionButtonsContainer = document.createElement('div')
    actionButtonsContainer.classList.add('action-buttons-container')

    //DELETE
    let deleteActionButton = document.createElement('a')
    deleteActionButton.classList.add('action-buttons', 'material-icons')
    deleteActionButton.setAttribute('href', '#')
    deleteActionButton.setAttribute('onclick', `deleteNote(${note.id})`)
    deleteActionButton.appendChild(document.createTextNode('check_circle'))

    //NOTE TEXT
    let noteTextContainer = document.createElement('div')
    noteTextContainer.classList.add('note-text-container')
    noteTextContainer.setAttribute('onclick', `openNote(${note.id})`)
    let textElement = document.createElement('p')

    let noteChar = note.text
    if (noteChar.length < 300) {
      //Se tamanho da nota for menor que 30, escrever nota inteira
      textElement.appendChild(document.createTextNode(noteChar))
    } else if (noteChar.length >= 300) {
      //Se tamanho da nota for maior que 30, escrever apenas até o 30º caractere e acrescentar botão para ver nota inteira
      let count = 0
      for (let noteCharAt of noteChar) {
        textElement.appendChild(document.createTextNode(noteCharAt))
        count = count + 1
        //"Ir escrevendo" cada caractere até chegar o 30º
        if (count == 300) {
          textElement.append(document.createTextNode(' ...'))
          textElement.append(document.createElement('br'))
          textElement.append(document.createTextNode('[VER MAIS]'))

          break
        }
      }
    }

    //DATE
    let noteDateContainer = document.createElement('div')
    noteDateContainer.classList.add('note-date-container')
    let dateElement = document.createElement('p')
    dateElement.appendChild(
      document.createTextNode(
        `작성: ${new Date(note.id).getUTCFullYear()}년 ${findMonth(
          new Date(note.id).getMonth()
        )} ${new Date(note.id).getDate()}일 시간 ${setTimeNumber(
          new Date(note.id).getHours()
        )}:${setTimeNumber(new Date(note.id).getMinutes())}`
      )
    )
    if (note.editedAt != undefined) {
      dateElement.appendChild(document.createElement('br'))
      dateElement.appendChild(
        document.createTextNode(
          `최종수정: ${new Date(note.id).getUTCFullYear()}년 ${findMonth(
            new Date(note.id).getMonth()
          )} ${new Date(note.id).getDate()}일 시간 ${setTimeNumber(
            new Date(note.id).getHours()
          )}:${setTimeNumber(new Date(note.editedAt).getMinutes())}`
        )
      )
    }

    //APPENDS
    actionButtonsContainer.appendChild(deleteActionButton)
    noteTextContainer.appendChild(textElement)
    noteDateContainer.appendChild(dateElement)
    noteTextContainer.appendChild(noteDateContainer)

    noteContainer.appendChild(actionButtonsContainer)
    noteContainer.appendChild(noteTextContainer)

    noteList.appendChild(noteContainer)
  }
}

function findMonth(number) {
  if (number == 0) {
    return '1월'
  } else if (number == 1) {
    return '2월'
  } else if (number == 2) {
    return '3월'
  } else if (number == 3) {
    return '4월'
  } else if (number == 4) {
    return '5월'
  } else if (number == 5) {
    return '6월'
  } else if (number == 6) {
    return '7월'
  } else if (number == 7) {
    return '8월'
  } else if (number == 8) {
    return '9월'
  } else if (number == 9) {
    return '10월'
  } else if (number == 10) {
    return '11월'
  } else if (number == 11) {
    return '12월'
  }
}

function findWeek(number) {
  if (number == 0) {
    return '일요일'
  } else if (number == 1) {
    return '월요일'
  } else if (number == 2) {
    return '화요일'
  } else if (number == 3) {
    return '수요일'
  } else if (number == 4) {
    return '목요일'
  } else if (number == 5) {
    return '금요일'
  } else if (number == 6) {
    return '토요일'
  }
}


function setTimeNumber(number) {
  if (number == 0) {
    return '00'
  } else if (number == 1) {
    return '01'
  } else if (number == 2) {
    return '02'
  } else if (number == 3) {
    return '03'
  } else if (number == 4) {
    return '04'
  } else if (number == 5) {
    return '05'
  } else if (number == 6) {
    return '06'
  } else if (number == 7) {
    return '07'
  } else if (number == 8) {
    return '08'
  } else if (number == 9) {
    return '09'
  } else if (number >= 10) {
    return number
  }
}

//ADICIONAR NOTA

noteButtonAdd.addEventListener('click', addNote)

//Habilitar/desabilitar botão Adicionar
noteButtonAdd.disabled = true
noteInput.addEventListener('input', function (event) {
  if (noteInput.value === '') {
    noteButtonAdd.disabled = true
  } else {
    noteButtonAdd.disabled = false
  }
})

// ADICIONAR NOTA

function addNote() {
  if (noteInput.value || '') {
    let objNote = {
      id: Date.now(),
      text: noteInput.value,
      priority: noteousSettings.priority
    }

    noteousMain.unshift(objNote)

    localStorage.setItem('noteous-main', JSON.stringify(noteousMain))

    renderNote()
    noteInput.value = ''
    noteInput.focus()
    noteButtonAdd.disabled = true
  }
}

//APAGAR NOTA

function deleteNote(noteId) {
  for (let note of noteousMain) {
    if (note.id === noteId) {
      //let indexPosition = noteousMain.indexOf(note)
      noteousMain.splice(noteousMain.indexOf(note), 1)
    }
  }

  localStorage.setItem('noteous-main', JSON.stringify(noteousMain))
  renderNote()
}

//função em variável para 'desbloquear' noteInput se tela é pequena
let noteInputEdit = function (event) {
  noteInput.removeAttribute('readonly')
  labelWrite.innerHTML = '📝 메모지 수정'
}

//ABRIR NOTA
function openNote(noteId) {
  editMode = true
  for (let note of noteousMain) {
    if (note.id === noteId) {
      notePriority('retrievePriority', note.priority)
      notePriority('retrievePriorityBlurInput', note.priority)
      noteousSettings.priority = note.priority
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    }
  }
  if (window.screen.width <= 600) {
    //Se for dispositivo móvel, ao abrir uma nota o teclado não irá aparecer imediatamente (readonly), mas ao tocar no campo de input o teclado aparecerá (readonly remove)
    noteInput.setAttribute('readonly', true)
    noteInput.focus()
    noteButtonCancelEdit.removeAttribute('hidden')
    labelWrite.innerHTML = '📄 메모지 수정'
    editNote(noteId)
    noteInput.addEventListener('click', noteInputEdit, false)
  } else if (window.screen.width >= 601) {
    noteInput.focus()
    noteButtonCancelEdit.removeAttribute('hidden')
    labelWrite.innerHTML = '📝 메모지 수정'
    editNote(noteId)
  }
}

//EDITAR NOTA

function editNote(noteId) {
  for (let note of noteousMain) {
    noteIdEdit = noteId
    if (note.id === noteId) {
      //Entra no Modo de edição
      editMode = true
      noteInput.classList.toggle('edit-mode')
      readSection.classList.toggle('edit-mode') //coloca a seção de leitura das nota no modo de edição (que desabilita as ações das notas enquanto uma nota está sendo editada)
      writePanel.classList.toggle('edit-mode')

      welcomeTextContainer.setAttribute('hidden', 'true')
      welcomePanel.classList.toggle('edit-mode')

      noteButtonAdd.setAttribute('hidden', 'true')

      noteInput.value = note.text //coloca o texto da nota dentro do campo de input

      noteInput.addEventListener('input', () => {
        if (editMode == true) {
          if (noteInput.value == note.text) {
            noteButtonEdit.setAttribute('hidden', 'true')
            noteButtonCancelEdit.removeAttribute('hidden')
            notePriority('retrievePriorityBlurInput', noteousSettings.priority)
          } else if (noteInput.value != note.text) {
            noteButtonEdit.removeAttribute('hidden')
            noteButtonCancelEdit.removeAttribute('hidden')
            notePriority('retrievePriority', noteousSettings.priority)
          }
        }
      })

      //Se durante Modo de edição clicar em "Confirmar edição"
      noteButtonEdit.addEventListener('click', () => {
        if (noteInput.value != '' && noteInput.value != null) {
          for (let note of noteousMain) {
            if (note.id === noteIdEdit) {
              note.text = noteInput.value
              note.editedAt = Date.now()
              note.priority = noteousSettings.priority
              localStorage.setItem('noteous-main', JSON.stringify(noteousMain))
            }
          }

          renderNote()

          exitEditMode()
        }
      })

      //Se durante Modo de edição clicar em "Cancelar"
      noteButtonCancelEdit.addEventListener('click', exitEditMode)
    }
  }
}

function exitEditMode() {
  editMode = false
  writePanel.classList.toggle('edit-mode')
  readSection.classList.toggle('edit-mode')

  noteInput.classList.toggle('edit-mode')
  noteInput.value = ''
  noteInput.removeAttribute('readonly')
  noteInput.removeEventListener('click', noteInputEdit, false)
  noteousSettings.priority = 'solid'
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  writeOptions.style.cssText = 'border-style: solid; opacity: 0;'
  noteInput.style.cssText = 'border-style: solid;'

  welcomePanel.classList.toggle('edit-mode')
  welcomeTextContainer.removeAttribute('hidden')

  noteButtonAdd.removeAttribute('hidden')
  noteButtonAdd.disabled = true
  noteButtonEdit.setAttribute('hidden', 'true')
  noteButtonCancelEdit.setAttribute('hidden', 'true')
  labelWrite.innerHTML = '다른 메모장'
}
