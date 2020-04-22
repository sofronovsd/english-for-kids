import './sass/style.scss';
import categories from './categories';
import { Category } from './category';
import { Card } from './card';
import { MenuItem } from './menuItem';
import { ButtonPanel } from './buttonPanel';
import { RatingPanel } from './ratingPanel';
import { Star } from './star';

const MAIN_PAGE = 'Main Page';
const STATISTICS = 'Statistics';
const GRID_HEADER_1 = 'Word';
const GRID_HEADER_2 = 'Translation';
const GRID_HEADER_3 = 'Correct Answers';
const GRID_HEADER_4 = 'Incorrect Answers';
const GRID_HEADER_5 = '%';

let isGameStarted;
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

const resetPlayMode = () => {
  const switchInput = document.querySelector('.switch__input');
  switchInput.checked = true;
};

const setActiveMenuItemByCategoryName = (categoryName) => {
  const menuItem = [...document.querySelectorAll('.menu__item')]
    .find((element) => element.textContent === categoryName);
  document.querySelector('.menu__item_active').classList.remove('menu__item_active');
  menuItem.classList.add('menu__item_active');
};

const isTrainMode = () => document.querySelector('.switch__input').checked;

const reproduceAudioBySource = (src) => {
  const audio = new Audio(src);
  audio.autoplay = true;
};

const isCorrectAnswer = (answer) => answer === currentCard;

const getMainComponent = () => document.querySelector('.main');

const getSideMenuList = () => document.querySelector('.menu__list');

const getRenderedCategories = () => categories.map((category) => new Category(category).render());

const addHtmlComponents = (components, mainElement) => {
  const wrapper = mainElement;
  wrapper.innerHTML = '';
  components.forEach((component) => {
    wrapper.innerHTML += component;
  });
};

const createCategoryCards = () => {
  const main = getMainComponent();
  const renderedCategories = getRenderedCategories();
  addHtmlComponents(renderedCategories, main);
};

const handleCategoryCardClick = (e) => {
  const categoryCard = e.target.closest('.main-card');
  if (categoryCard) {
    resetPlayMode();

    const categoryName = categoryCard.textContent.trim();
    initCardsByCategoryName(categoryName);
    setActiveMenuItemByCategoryName(categoryName);
  }
};

const addClickOnCategoryCardHandler = () => {
  const main = getMainComponent();
  main.addEventListener('click', handleCategoryCardClick);
};

const initMainMenu = () => {
  setHeaderTitle(MAIN_PAGE);
  createCategoryCards();
  addClickOnCategoryCardHandler();
};

const updateStorageData = (key) => {
  let value = window.localStorage.getItem(key);
  if (value !== null) {
    value = Number(value) + 1;
  } else {
    value = 1;
  }
  window.localStorage.setItem(key, String(value));
};

const handleCommonCardMouseOut = (e) => {
  const card = e.target.closest('.card');
  card.classList.remove('card_translate');
  card.removeEventListener('mouseout', handleCommonCardMouseOut);
};

const handleClickOnCardRotate = (cardRotate) => {
  const card = cardRotate.closest('.card');
  card.classList.add('card_translate');
  card.addEventListener('mouseout', handleCommonCardMouseOut);
};

const addStarToRating = (isWin) => {
  const rating = document.querySelector('.main__rating');
  rating.innerHTML += new Star(isWin).render();
};

const isGameFinished = () => currentIndex === shuffledCards.length - 1;

const isPlayerWin = () => incorrectAnswers === 0;

const finishGame = () => {
  setTimeout(() => {
    resetPlayMode();
    initMainMenu();
  }, 3000);
};

const showSuccessfulResultScreen = () => {
  reproduceAudioBySource('./audio/success.mp3');

  const img = document.createElement('img');
  img.src = './img/success.jpg';

  const main = getMainComponent();
  main.innerHTML = '';
  main.append(img);

  finishGame();
};

const showFailResultScreen = () => {
  reproduceAudioBySource('./audio/failure.mp3');

  const img = document.createElement('img');
  img.src = './img/failure.jpg';
  const text = document.createElement('h2');
  text.textContent = `${incorrectAnswers} errors`;

  const main = getMainComponent();
  main.innerHTML = '';
  main.append(text, img);

  finishGame();
};

const switchToNextCard = () => {
  currentIndex += 1;
  currentCard = shuffledCards[currentIndex];
  setTimeout(() => { reproduceAudioBySource(currentCard.getAttribute('data-audio')); }, 1000);
};

const checkIsGameFinished = () => {
  if (isGameFinished()) {
    if (isPlayerWin()) {
      showSuccessfulResultScreen();
    } else {
      showFailResultScreen();
    }
  } else {
    switchToNextCard();
  }
};

const processPlayerAnswer = (answerCard) => {
  if (isCorrectAnswer(answerCard)) {
    answerCard.classList.add('card__front_inactive');

    updateStorageData(`${String(answerCard.textContent).split('\n').join('')}-success`);
    addStarToRating(true);
    reproduceAudioBySource('./audio/correct.mp3');
    checkIsGameFinished();
  } else {
    incorrectAnswers += 1;

    updateStorageData(`${String(answerCard.textContent).split('\n').join('')}-failure`);
    addStarToRating(false);
    reproduceAudioBySource('./audio/error.mp3');
  }
};

const handleClickOnCardFront = (cardFront) => {
  if (isTrainMode()) {
    reproduceAudioBySource(cardFront.getAttribute('data-audio'));
  } else if (!cardFront.classList.contains('card__front_inactive') && isGameStarted) {
    processPlayerAnswer(cardFront);
  }
};

const handleCommonCardClick = (e) => {
  const { target } = e;
  if (target.classList.contains('card__rotate')) {
    handleClickOnCardRotate(target);
  } else if (target.classList.contains('card__front')) {
    handleClickOnCardFront(target);
  }
};

const addCommonCardClickHandler = () => {
  const main = getMainComponent();
  main.addEventListener('click', handleCommonCardClick);
};

const getStartButton = () => document.querySelector('.button');

const getShuffledCards = () => {
  const cards = document.querySelectorAll('.card__front');
  return [...cards].sort(() => Math.random() - 0.5);
};

const initGameVariables = () => {
  isGameStarted = true;
  shuffledCards = getShuffledCards();
  currentIndex = 0;
  currentCard = shuffledCards[currentIndex];
  incorrectAnswers = 0;
};

const handleStartButtonClick = (e) => {
  const button = e.target;
  if (button.className === 'button') {
    button.classList.add('button_repeat');
    initGameVariables();
  }
  reproduceAudioBySource(currentCard.getAttribute('data-audio'));
};

const addStartButtonClickHandler = () => {
  const button = getStartButton();
  button.addEventListener('click', handleStartButtonClick);
};

const getRenderedCardsByCategoryName = (categoryName) => {
  const category = categories.find((item) => item.title === categoryName);
  return category.cards.map((card) => new Card(card).render());
};

const createCardsByCategoryName = (categoryName) => {
  const main = getMainComponent();
  const renderedCards = getRenderedCardsByCategoryName(categoryName);

  const ratingPanel = new RatingPanel().render();
  const buttonPanel = new ButtonPanel().render();

  renderedCards.unshift(ratingPanel);
  renderedCards.push(buttonPanel);
  addHtmlComponents(renderedCards, main);
};

const initCardsByCategoryName = (categoryName) => {
  setHeaderTitle(categoryName);
  createCardsByCategoryName(categoryName);
  addCommonCardClickHandler();
  addStartButtonClickHandler();
};

const handleSwitcherChange = (e) => {
  const { target } = e;
  const mainCards = document.querySelectorAll('.main-card');
  const cards = document.querySelectorAll('.card');
  const menuList = getSideMenuList();
  const button = getStartButton();

  if (target.checked) {
    mainCards.forEach((card) => card.classList.add('main-card_green'));
    menuList.classList.add('menu__list_green');
    cards.forEach((card) => card.classList.remove('card_cover'));

    if (button) {
      button.classList.add('button_hidden');
    }
  } else {
    mainCards.forEach((card) => card.classList.remove('main-card_green'));
    menuList.classList.remove('menu__list_green');
    cards.forEach((card) => card.classList.add('card_cover'));

    if (button) {
      button.classList.remove('button_hidden');
    }
  }
  closeSideMenu();
};

const getSwitcher = () => document.querySelector('.switch__input');

const addSwitcherChangeHandler = () => {
  const switcher = getSwitcher();
  switcher.addEventListener('change', handleSwitcherChange);
};

const createSpanWithContent = (content) => {
  const element = document.createElement('span');
  element.textContent = content;
  return element;
};

const createCategoryGridHeader = (grid) => {
  const gridHeader1 = createSpanWithContent(GRID_HEADER_1);
  const gridHeader2 = createSpanWithContent(GRID_HEADER_2);
  const gridHeader3 = createSpanWithContent(GRID_HEADER_3);
  const gridHeader4 = createSpanWithContent(GRID_HEADER_4);
  const gridHeader5 = createSpanWithContent(GRID_HEADER_5);

  grid.append(gridHeader1, gridHeader2, gridHeader3, gridHeader4, gridHeader5);
};

const getPercentRatio = (correctData, incorrectData) => {
  const correct = Number(correctData);
  let incorrect = Number(incorrectData);
  let result;
  if (correct && correct > 0) {
    if (incorrect === null) {
      incorrect = 0;
    }
    result = correct / (correct + incorrect);
    result = `${Math.round(result * 100)}%`;
  } else {
    result = '0%';
  }
  return result;
};

const createStatisticForCard = (card, grid) => {
  const word = createSpanWithContent(card.word);

  const translation = createSpanWithContent(card.translation);

  const correctData = window.localStorage.getItem(`${card.word}-success`);
  const correctDataElement = createSpanWithContent(correctData !== null ? correctData : 0);

  const incorrectData = window.localStorage.getItem(`${card.word}-failure`);
  const incorrectDataElement = createSpanWithContent(incorrectData !== null ? incorrectData : 0);

  const ratio = createSpanWithContent(getPercentRatio(correctData, incorrectData));

  grid.append(word, translation, correctDataElement, incorrectDataElement, ratio);
};

const createStatisticForCategory = (category, wrapper) => {
  const title = document.createElement('h3');
  title.textContent = category.title;
  wrapper.append(title);

  const grid = document.createElement('div');
  grid.classList.add('main__grid');
  createCategoryGridHeader(grid);
  wrapper.append(grid);

  category.cards.forEach((card) => createStatisticForCard(card, grid));
};

const initStatistics = () => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('statistics-container');

  categories.forEach((category) => createStatisticForCategory(category, wrapper));

  const main = getMainComponent();
  main.innerHTML = '';
  main.append(wrapper);
};

const getRenderedMenuItems = () => {
  return categories.map((category) => new MenuItem(category.title).render());
};

const createSideMenuItems = () => {
  const menuList = getSideMenuList();
  const listItems = getRenderedMenuItems();

  const mainPage = new MenuItem(MAIN_PAGE).render();
  const statistics = new MenuItem(STATISTICS).render();

  listItems.unshift(mainPage);
  listItems.push(statistics);
  addHtmlComponents(listItems, menuList);
};

const handleSideMenuClick = (e) => {
  const { target } = e;
  if (target.classList.contains('menu__item')) {
    resetPlayMode();
    const categoryName = target.textContent;
    setActiveMenuItemByCategoryName(categoryName);

    switch (categoryName) {
      case MAIN_PAGE: {
        initMainMenu();
        break;
      }
      case STATISTICS: {
        initStatistics();
        break;
      }
      default: {
        initCardsByCategoryName(categoryName);
      }
    }

    closeSideMenu();
  }
};

const addSideMenuClickHandler = () => {
  const menuList = getSideMenuList();
  menuList.addEventListener('click', handleSideMenuClick);
};

const initSideMenu = () => {
  createSideMenuItems();
  document.querySelector('.menu__item').classList.add('menu__item_active');
  addSideMenuClickHandler();
};

const handleDocumentClick = (e) => {
  if (!e.target.closest('.menu')) {
    closeSideMenu();
  }
};

window.onload = () => {
  addSwitcherChangeHandler();
  initMainMenu();
  initSideMenu();
  document.addEventListener('click', handleDocumentClick);
};
