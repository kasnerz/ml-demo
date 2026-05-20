(function () {
    function sortImageNames(a, b) {
        return Number.parseInt(a, 10) - Number.parseInt(b, 10);
    }

    function qs(selector) {
        return document.querySelector(selector);
    }

    function qsa(selector) {
        return Array.from(document.querySelectorAll(selector));
    }

    document.addEventListener('DOMContentLoaded', function () {
        const bootstrap = window.ML_QUIZ_BOOTSTRAP || {};
        const lang = bootstrap.lang || 'cs';
        const basePath = bootstrap.basePath || '.';
        const initialQuizConfig = bootstrap.quizConfig || window.ML_QUIZ_CONFIG || null;
        const translations = (window.ML_QUIZ_TRANSLATIONS || {})[lang] || window.ML_QUIZ_TRANSLATIONS.cs;
        const dialog = qs('#results-dialog');

        const state = {
            quizConfig: null,
            currentMode: null,
            currentImageIndex: 0,
            imageList: [],
            answerSelected: false,
            correctAnswers: 0,
            totalQuestions: 0,
            userAnswers: {}
        };

        function assetPath(path) {
            return basePath + '/' + path;
        }

        function applyTranslations() {
            document.documentElement.lang = lang;
            document.title = translations.page_title;

            qsa('[data-i18n]').forEach(function (element) {
                const key = element.dataset.i18n;
                if (translations[key]) {
                    element.textContent = translations[key];
                }
            });

            qsa('[data-i18n-aria-label]').forEach(function (element) {
                const key = element.dataset.i18nAriaLabel;
                if (translations[key]) {
                    element.setAttribute('aria-label', translations[key]);
                }
            });

            const switchLink = qs('#lang-switch');
            if (switchLink) {
                switchLink.href = bootstrap.langSwitchHref || (lang === 'cs' ? 'en/' : '../');
                switchLink.textContent = translations.language_switch;
            }
        }

        function showStatus(message, stateName) {
            const status = qs('#status-message');
            if (!status) {
                return;
            }
            status.textContent = message;
            status.dataset.state = stateName || 'info';
        }

        function updateNavigationButtons() {
            qs('#prev-btn').disabled = state.currentImageIndex === 0;
            qs('#next-btn').disabled = state.currentImageIndex >= state.imageList.length - 1;
            qs('#restart-btn').disabled = state.imageList.length === 0;
        }

        function getAnswerMap(mode) {
            return mode === 'train' ? state.quizConfig.train_answers : state.quizConfig.test_answers;
        }

        function resetAnswerButtons() {
            qsa('.answer-btn').forEach(function (button) {
                button.classList.remove('correct', 'incorrect');
            });
        }

        function paintAnsweredState(imageName) {
            const selectedIndex = state.userAnswers[imageName];
            const correctIndex = getAnswerMap(state.currentMode)[imageName];

            qsa('.answer-btn').forEach(function (button, index) {
                if (index === correctIndex) {
                    button.classList.add('correct');
                } else if (index === selectedIndex && index !== correctIndex) {
                    button.classList.add('incorrect');
                }
            });
        }

        function showCurrentImage() {
            if (state.imageList.length === 0) {
                return;
            }

            const imageName = state.imageList[state.currentImageIndex];
            const imageUrl = assetPath('assets/img/' + state.currentMode + '/' + encodeURIComponent(imageName));
            const alreadyAnswered = Object.prototype.hasOwnProperty.call(state.userAnswers, imageName);

            qs('#quiz-image').src = imageUrl;
            qs('#quiz-image').style.display = 'block';
            qs('#image-placeholder').hidden = true;
            qs('#current-image').textContent = String(state.currentImageIndex + 1);
            qs('#total-images').textContent = String(state.imageList.length);
            state.answerSelected = alreadyAnswered;

            resetAnswerButtons();

            if (alreadyAnswered) {
                paintAnsweredState(imageName);
            }
        }

        function showResultsModal() {
            const accuracy = state.totalQuestions > 0 ? Math.round((state.correctAnswers / state.totalQuestions) * 100) : 0;

            qs('#accuracy-percentage').textContent = accuracy + '%';
            qs('#correct-answers').textContent = String(state.correctAnswers);
            qs('#total-questions').textContent = String(state.totalQuestions);
            qs('#modal-mode-label').textContent = state.currentMode === 'train'
                ? translations.modal_train_label
                : translations.modal_test_label;

            if (typeof dialog.showModal === 'function') {
                dialog.showModal();
            } else {
                dialog.setAttribute('open', 'open');
            }
        }

        function closeResultsDialog() {
            if (typeof dialog.close === 'function') {
                dialog.close();
            } else {
                dialog.removeAttribute('open');
            }
        }

        function selectAnswer(selectedIndex) {
            if (state.answerSelected || !state.quizConfig || state.imageList.length === 0) {
                return;
            }

            const imageName = state.imageList[state.currentImageIndex];
            const correctIndex = getAnswerMap(state.currentMode)[imageName];
            state.answerSelected = true;

            if (!Object.prototype.hasOwnProperty.call(state.userAnswers, imageName)) {
                state.totalQuestions += 1;
                if (selectedIndex === correctIndex) {
                    state.correctAnswers += 1;
                }
                state.userAnswers[imageName] = selectedIndex;
            }

            paintAnsweredState(imageName);

            if (selectedIndex === correctIndex) {
                showStatus(translations.correct, 'success');
            } else {
                showStatus(translations.incorrect, 'error');
            }

            if (state.currentImageIndex === state.imageList.length - 1) {
                window.setTimeout(showResultsModal, 900);
            }
        }

        function setupAnswerButtons() {
            const buttonContainer = qs('#answer-buttons');
            buttonContainer.innerHTML = '';

            state.quizConfig.answer_options.forEach(function (option, index) {
                const button = document.createElement('button');
                button.className = 'answer-btn';
                button.type = 'button';
                button.textContent = option;
                button.addEventListener('click', function () {
                    selectAnswer(index);
                });
                buttonContainer.appendChild(button);
            });
        }

        function initializeQuiz(mode) {
            state.currentMode = mode;
            state.currentImageIndex = 0;
            state.answerSelected = false;
            state.correctAnswers = 0;
            state.totalQuestions = 0;
            state.userAnswers = {};
            state.imageList = Object.keys(getAnswerMap(mode)).sort(sortImageNames);

            qs('#loading-spinner').style.display = 'block';
            qs('#answer-buttons').hidden = true;
            showStatus(translations.loading_images, 'info');

            if (state.imageList.length === 0) {
                qs('#loading-spinner').style.display = 'none';
                showStatus(translations.no_images + ' ' + mode + '.', 'error');
                updateNavigationButtons();
                return;
            }

            setupAnswerButtons();
            showCurrentImage();
            updateNavigationButtons();
            qs('#answer-buttons').hidden = false;
            qs('#loading-spinner').style.display = 'none';
            showStatus(translations.quiz_loaded, 'info');
        }

        function setMode(mode) {
            qsa('.mode-btn').forEach(function (button) {
                button.classList.toggle('active', button.dataset.mode === mode);
            });
            initializeQuiz(mode);
        }

        applyTranslations();

        qs('#prev-btn').addEventListener('click', function () {
            if (state.currentImageIndex > 0) {
                state.currentImageIndex -= 1;
                showCurrentImage();
                updateNavigationButtons();
            }
        });

        qs('#next-btn').addEventListener('click', function () {
            if (state.currentImageIndex < state.imageList.length - 1) {
                state.currentImageIndex += 1;
                showCurrentImage();
                updateNavigationButtons();
            }
        });

        qs('#restart-btn').addEventListener('click', function () {
            if (state.currentMode) {
                initializeQuiz(state.currentMode);
            }
        });

        qs('#restart-from-modal').addEventListener('click', function () {
            closeResultsDialog();
            if (state.currentMode) {
                initializeQuiz(state.currentMode);
            }
        });

        qsa('[data-close-dialog]').forEach(function (button) {
            button.addEventListener('click', closeResultsDialog);
        });

        qsa('.mode-btn').forEach(function (button) {
            button.addEventListener('click', function () {
                setMode(button.dataset.mode);
            });
        });

        if (!initialQuizConfig) {
            showStatus(translations.error_loading_config, 'error');
            return;
        }

        state.quizConfig = initialQuizConfig;
        setMode('train');
    });
})();
