document.addEventListener('DOMContentLoaded', function() {
    const links = {
        home: document.getElementById('home-link'),
        calendar: document.getElementById('calendar-link'),
        music: document.getElementById('music-link'),
        notes: document.getElementById('notes-link'),
        quiz: document.getElementById('quiz-link'),
    };
    const sections = {
        home: document.getElementById('home'),
        calendar: document.getElementById('calendar'),
        music: document.getElementById('music-player'),
        notes: document.getElementById('notes'),
        quiz: document.getElementById('quiz'),
    };
    function initializeSections() {
        for (const section in sections) {
            sections[section].style.display = section === 'home' ? 'block' : 'none';
        }
    }
    initializeSections();
    function showSection(sectionToShow) {
        for (const section in sections) {
            sections[section].style.display = 'none';
        }
        sections[sectionToShow].style.display = 'block';
    }
    links.home.addEventListener('click', (event) => {
        event.preventDefault();
        showSection('home');
    });
    links.calendar.addEventListener('click', (event) => {
        event.preventDefault();
        showSection('calendar');
        initializeCalendar();
    });
    links.music.addEventListener('click', (event) => {
        event.preventDefault();
        showSection('music');
        initializeMusicPlayer(); 
    });
    links.notes.addEventListener('click', (event) => {
        event.preventDefault();
        showSection('notes');
        initializeNotes(); 
    });
    links.quiz.addEventListener('click', (event) => {
        event.preventDefault();
        showSection('quiz');
        initializeQuiz(); 
    });
    function initializeMusicPlayer() {
        const audioPlayer = document.getElementById('audio-player');
        const uploadMusic = document.getElementById('upload-music');

        uploadMusic.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                audioPlayer.src = url;
            }
        });
    }
    function initializeNotes() {
        const noteInput = document.getElementById('note-input');
        const saveNoteBtn = document.getElementById('save-note-btn');
        const notesList = document.getElementById('notes-list');
        let notes = JSON.parse(localStorage.getItem('notes')) || [];

        function renderNotes() {
            notesList.innerHTML = notes.map((note, index) =>
                `<div class="note">
                    <p>${note}</p>
                    <button data-index="${index}">Delete</button>
                </div>`
            ).join('');
        }
        saveNoteBtn.addEventListener('click', () => {
            const noteText = noteInput.value.trim();
            if (noteText) {
                notes.push(noteText);
                noteInput.value = '';
                localStorage.setItem('notes', JSON.stringify(notes));
                renderNotes();
            }
        });

        notesList.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                const index = event.target.dataset.index;
                notes.splice(index, 1);
                localStorage.setItem('notes', JSON.stringify(notes));
                renderNotes();
            }
        });

        renderNotes();
    }
    function initializeQuiz() {
        const quizContainer = document.getElementById('quiz-container');
        const submitQuizBtn = document.getElementById('submit-quiz-btn');
        const quizResults = document.getElementById('quiz-results');

        const questions = [
            { question: 'The term "yoga" originates from which Sanskrit word?', options: ['Dharma', 'Karma', 'Yuj', 'Shakti'], answer: 'Yuj' },
            { question: 'Which asana resembles a cobra with the body raised off the ground?', options: ['Bhujangasana', 'Vrikshasana', 'Tadasana', 'Adho Mukha Svanasana'], answer: 'Bhujangasana' },
            { question: 'What is the yogic term for the five "sheaths" that make up the human being?', options: ['Chakras', 'Gunas', 'Koshas', 'Pranas'], answer: 'Koshas' },
            { question: 'What pose is known as the "Mountain Pose" in yoga?', options: ['Tadasana', 'Vrikshasana', 'Adho Mukha Svanasana', 'Virabhadrasana I'], answer: 'Tadasana' },
            { question: 'What is the main focus of Hatha yoga?', options: ['Meditation and spiritual development', 'Physical postures and breathing exercises', 'Ethical conduct and selfless service', 'Mantras and chanting'], answer: 'Physical postures and breathing exercises' },
            { question: 'What is the name of the cleansing practices in yoga?', options: ['Mudras', 'Asanas', 'Pranayamas', 'Shatkriyas'], answer: 'Shatkriyas' },
            { question: 'Which chakra is believed to be associated with the heart centre?', options: ['Muladhara', 'Svadhisthana', 'Anahata', 'Vishuddha'], answer: 'Anahata' },
            { question: 'When is International Day of Yoga celebrated globally?', options: ['June 21st', 'March 20th', 'August 15th', 'December 10th'], answer: 'June 21st' },
            { question: 'Which yoga style is known for its flowing sequences synchronized with breath?', options: ['Hatha yoga', 'Iyengar yoga', 'Vinyasa yoga', 'Restorative yoga'], answer: 'Vinyasa yoga' },
        ];


        function renderQuiz() {
            quizContainer.innerHTML = questions.map((q, index) =>
                `<div class="quiz-question">
                    <p>${q.question}</p>
                    ${q.options.map(option => 
                        `<label>
                            <input type="radio" name="question-${index}" value="${option}"> ${option}
                        </label>`
                    ).join('<br>')}
                </div>`
            ).join('');
        }
        

        submitQuizBtn.addEventListener('click', () => {
            let score = 0;
            questions.forEach((q, index) => {
                const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
                if (selectedOption && selectedOption.value === q.answer) {
                    score++;
                }
            });
            quizResults.textContent = `You scored ${score} out of ${questions.length}`;
        });

        renderQuiz();
    }
    function initializeCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        const eventForm = document.getElementById('eventForm');
        const eventTitleInput = document.getElementById('eventTitle');
        const eventDateInput = document.getElementById('eventDate');
        const prevButton = document.getElementById('prev-month');
        const nextButton = document.getElementById('next-month');

        let currentMonth = new Date().getMonth(); 
        let currentYear = new Date().getFullYear();
        let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];

        function renderCalendar() {
            calendarGrid.innerHTML = '';
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(currentYear, currentMonth));

            document.getElementById('calendar-month').innerText = `${monthName} ${currentYear}`;

            for (let day = 1; day <= daysInMonth; day++) {
                let dayElement = document.createElement('div');
                dayElement.classList.add('day');
                dayElement.innerHTML = day;

                const event = events.find(e => e.date === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
                if (event) {
                    const eventElement = document.createElement('p');
                    eventElement.innerText = event.title;
                    dayElement.appendChild(eventElement);
                    dayElement.addEventListener('click', () => editEvent(event));
                } else {
                    dayElement.addEventListener('click', () => showForm(day));
                }
                calendarGrid.appendChild(dayElement);
            }
        }

        function showForm(day) {
            eventForm.style.display = 'block';
            eventDateInput.value = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }

        eventForm.addEventListener('submit', (event) => {
            event.preventDefault();
            saveEvent();
        });

        function saveEvent() {
            const title = eventTitleInput.value;
            const date = eventDateInput.value;

            if (title && date) {
                const existingEventIndex = events.findIndex(event => event.date === date);
                if (existingEventIndex > -1) {
                    events[existingEventIndex].title = title; 
                } else {
                    events.push({ title, date }); 
                }
                localStorage.setItem('calendarEvents', JSON.stringify(events));
                eventForm.style.display = 'none';
                renderCalendar();
            }
        }

        function editEvent(event) {
            showForm(parseInt(event.date.split('-')[2]));
            eventTitleInput.value = event.title;
        }

        prevButton.addEventListener('click', () => {
            if (currentMonth === 0) {
                currentMonth = 11;
                currentYear--;
            } else {
                currentMonth--;
            }
            renderCalendar();
        });

        nextButton.addEventListener('click', () => {
            if (currentMonth === 11) {
                currentMonth = 0;
                currentYear++;
            } else {
                currentMonth++;
            }
            renderCalendar();
        });

        renderCalendar(); 
    }
});
