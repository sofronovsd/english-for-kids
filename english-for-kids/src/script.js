import './sass/style.scss';
import categories from './categories';
import { Category } from './category';
import { Card } from './card';
import { MenuItem } from './menuItem';
import { ButtonPanel } from './buttonPanel';
import { RatingPanel } from './ratingPanel';
import { Star } from './star';

let isStarted;
let shuffledCards;
let incorrectAnswers;
let currentCard;
let currentIndex;

const setHeaderTitle = (title) => {
  const headerTitle = document.querySelector('.header__title');
  headerTitle.textContent = title;
};

const closeSideMenu = () => {
  const menuInput = document.querySelector('.menu__input');
  menuInput.checked = false;
};

const changeSelectedMenuItem = (element) => {
  document.querySelector('.menu__item_active').classList.remove('menu__item_active');
  element.classList.add('menu__item_active');
};

const isTrainMode = () => document.querySelector('.switch__input').checked;

const reproduceCard = (card) => {
  const audio = new Audio(card.getAttribute('data-audio'));
  audio.autoplay = true;
};

const resetPlayMode = () => {
  document.querySelector('.switch__input').checked = true;
};

const isCorrectAnswer = (answer) => answer === currentCard;

const initMainMenu = () => {
  const main = document.querySelector('.main');
  const mainCards = categories.map((category) => new Category(category).render());
  setHeaderTitle('Main Page');

  main.innerHTML = '';
  mainCards.forEach((card) => {
    main.innerHTML += card;
  });

  main.addEventListener('click', (e) => {
    const mainCard = e.target.closest('.main-card');
    if (mainCard) {
      resetPlayMode();
      const categoryName = mainCard.textContent.trim();
      createCardsByCategoryName(categoryName);
      const menuItem = [...document.querySelectorAll('.menu__item')]
        .find((element) => element.textContent === categoryName);
      changeSelectedMenuItem(menuItem);
    }
  });
};

const updateDataInfo = (key) => {
  let value = window.localStorage.getItem(key);
  if (value !== null) {
    value = Number(value) + 1;
  } else {
    value = 1;
  }
  window.localStorage.setItem(key, String(value));
};

const initCards = () => {
  const main = document.querySelector('.main');
  main.addEventListener('click', (e) => {
    const { target } = e;
    if (target.classList.contains('card__rotate')) {
      const card = target.closest('.card');
      card.classList.add('card_translate');
      card.addEventListener('mouseout', () => {
        card.classList.remove('card_translate');
      });
    } else if (target.classList.contains('card__front')) {
      if (isTrainMode()) {
        reproduceCard(target);
      } else if (!target.classList.contains('card__front_inactive') && isStarted) {
        const rating = document.querySelector('.main__rating');
        if (isCorrectAnswer(target)) {
          updateDataInfo(`${String(target.textContent).split('\n').join('')}-success`);
          target.classList.add('card__front_inactive');
          rating.innerHTML += new Star(true).render();
          new Audio('./audio/correct.mp3').autoplay = true;
          if (currentIndex === shuffledCards.length - 1) {
            if (incorrectAnswers === 0) {
              new Audio('./audio/success.mp3').autoplay = true;
              const img = document.createElement('img');
              img.src = './img/success.jpg';
              main.innerHTML = '';
              main.append(img);
              setTimeout(() => {
                resetPlayMode();
                initMainMenu();
              }, 3000);
            } else {
              new Audio('./audio/failure.mp3').autoplay = true;
              const img = document.createElement('img');
              img.src = './img/failure.jpg';
              main.innerHTML = '';
              const text = document.createElement('h2');
              text.textContent = `${incorrectAnswers} errors`;
              main.append(text);
              main.append(img);
              setTimeout(() => {
                resetPlayMode();
                initMainMenu();
              }, 3000);
            }
          } else {
            currentIndex += 1;
            currentCard = shuffledCards[currentIndex];
            setTimeout(() => { reproduceCard(currentCard); }, 1000);
          }
        } else {
          updateDataInfo(`${String(target.textContent).split('\n').join('')}-failure`);
          incorrectAnswers += 1;
          rating.innerHTML += new Star(false).render();
          new Audio('./audio/error.mp3').autoplay = true;
        }
      }
    }
  });
};

const initButtonPanel = () => {
  const button = document.querySelector('.button');

  button.addEventListener('click', () => {
    if (button.className === 'button') {
      button.classList.add('button_repeat');
      isStarted = true;
      const cards = document.querySelectorAll('.card__front');
      shuffledCards = [...cards].sort(() => Math.random() - 0.5);
      currentIndex = 0;
      currentCard = shuffledCards[currentIndex];
      incorrectAnswers = 0;
      reproduceCard(currentCard);
    } else if (button.classList.contains('button_repeat')) {
      reproduceCard(currentCard);
    }
  });
};

const createCardsByCategoryName = (categoryName) => {
  const category = categories.find((item) => item.title === categoryName);
  const renderedCards = category.cards.map((card) => new Card(card).render());
  const main = document.querySelector('.main');
  setHeaderTitle(categoryName);

  main.innerHTML = '';
  main.innerHTML += new RatingPanel().render();

  renderedCards.forEach((card) => {
    main.innerHTML += card;
  });

  main.innerHTML += new ButtonPanel().render();

  initCards();
  initButtonPanel();
};

const initSwitcher = () => {
  const switcher = document.querySelector('.switch__input');
  switcher.addEventListener('change', (e) => {
    const { target } = e;
    const mainCards = document.querySelectorAll('.main-card');
    const cards = document.querySelectorAll('.card');
    const menuList = document.querySelector('.menu__list');
    const button = document.querySelector('.button');

    if (target.checked) {
      mainCards.forEach((card) => card.classList.add('main-card_green'));
      menuList.classList.add('menu__list_green');
      cards.forEach((card) => card.classList.remove('card_cover'));
      button.classList.add('button_hidden');
    } else {
      mainCards.forEach((card) => card.classList.remove('main-card_green'));
      menuList.classList.remove('menu__list_green');
      cards.forEach((card) => card.classList.add('card_cover'));
      button.classList.remove('button_hidden');
    }
    closeSideMenu();
  });
};

const initStatistics = () => {
  const main = document.querySelector('.main');
  main.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.classList.add('statistics-container');
  categories.forEach((category) => {
    const title = document.createElement('h3');
    title.textContent = category.title;
    wrapper.append(title);

    const grid = document.createElement('div');
    grid.classList.add('main__grid');

    const word = document.createElement('span');
    word.textContent = 'Word';
    const translation = document.createElement('span');
    translation.textContent = 'Translation';
    const correctAnswers = document.createElement('span');
    correctAnswers.textContent = 'Correct Answers';
    const incorrectAnswersElement = document.createElement('span');
    incorrectAnswersElement.textContent = 'Incorrect Answers';
    const ratio = document.createElement('span');
    ratio.textContent = '%';
    grid.append(word, translation, correctAnswers, incorrectAnswersElement, ratio);
    wrapper.append(grid);
    category.cards.forEach((card) => {
      const wordElement = document.createElement('span');
      wordElement.textContent = card.word;
      const translationElement = document.createElement('span');
      translationElement.textContent = card.translation;
      const correct = document.createElement('span');
      const correctData = window.localStorage.getItem(`${card.word}-success`);
      correct.textContent = correctData !== null ? correctData : 0;
      const incorrect = document.createElement('span');
      const incorrectData = window.localStorage.getItem(`${card.word}-failure`);
      incorrect.textContent = incorrectData !== null ? incorrectData : 0;
      const ratioElement = document.createElement('span');

      let result;
      if (incorrectData) {
        result = correctData / incorrectData;
        result = `${Math.round(result * 100)}%`;
      } else if (correctData) {
        result = '100%';
      } else {
        result = '0%';
      }

      ratioElement.textContent = result;
      grid.append(wordElement, translationElement, correct, incorrect, ratioElement);
    });
  });
  main.append(wrapper);
};

const initSideMenu = () => {
  const menuList = document.querySelector('.menu__list');
  const listItems = categories.map((category) => new MenuItem(category.title).render());
  menuList.innerHTML = '';
  menuList.innerHTML += new MenuItem('Main Page').render();
  listItems.forEach((item) => {
    menuList.innerHTML += item;
  });
  menuList.innerHTML += new MenuItem('Statistics').render();
  document.querySelector('.menu__item').classList.add('menu__item_active');

  menuList.addEventListener('click', (e) => {
    const { target } = e;
    if (target.classList.contains('menu__item')) {
      resetPlayMode();
      changeSelectedMenuItem(target);
      const categoryName = target.textContent;

      switch (categoryName) {
        case 'Main Page': {
          initMainMenu();
          break;
        }
        case 'Statistics': {
          initStatistics();
          break;
        }
        default: {
          createCardsByCategoryName(categoryName);
        }
      }

      closeSideMenu();
    }
  });
};

window.onload = () => {
  initSwitcher();
  initMainMenu();
  initSideMenu();

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu')) {
      closeSideMenu();
    }
  });
};
