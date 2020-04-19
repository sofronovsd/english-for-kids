import './sass/style.scss';
import categories from './categories';
import {Category} from './category';
import {Card} from './card';
import {MenuItem} from './menuItem';

window.onload = () => {
    console.log('Made by Sofronov :)');

    initSwitcher();
    initMainMenu();
    initSideMenu();
};

const initSwitcher = () => {
    const switcher = document.querySelector('.switch__input');
    switcher.addEventListener('change', (e) => {
        const target = e.target;
        const mainCards = document.querySelectorAll('.main-card');
        const menuList = document.querySelector('.menu__list');
        const menuInput = document.querySelector('.menu__input');
        if (target.checked) {
            mainCards.forEach(card => card.classList.add('main-card_green'));
            menuList.classList.add('menu__list_green')
        } else {
            mainCards.forEach(card => card.classList.remove('main-card_green'));
            menuList.classList.remove('menu__list_green')
        }
        menuInput.checked = false;
    })
};

const initMainMenu = () => {
    const main = document.querySelector('.main');
    let mainCards = categories.map(category => new Category(category).render());
    setHeaderTitle('Main Page');

    main.innerHTML = '';
    mainCards.forEach(card => {
        main.innerHTML += card;
    });

    main.addEventListener('click', (e) => {
        const mainCard = e.target.closest('.main-card');
        if (mainCard) {
            const categoryName = mainCard.textContent.trim();
            createCardsByCategoryName(categoryName);
            const menuItem = [...document.querySelectorAll('.menu__item')]
                .find(element => element.textContent === categoryName);
            changeSelectedMenuItem(menuItem);
        }
    })
};

const initSideMenu = () => {
    const menuList = document.querySelector('.menu__list');
    let listItems = categories.map(category => new MenuItem(category.title).render());
    menuList.innerHTML = '';
    menuList.innerHTML += new MenuItem('Main Page').render();
    listItems.forEach(item => {
        menuList.innerHTML += item;
    });
    document.querySelector('.menu__item').classList.add('menu__item_active');

    menuList.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('menu__item')) {
            changeSelectedMenuItem(target);
            const categoryName = target.textContent;
            if (categoryName !== 'Main Page') {
                createCardsByCategoryName(categoryName);
            } else {
                initMainMenu();
            }

            const menuInput = document.querySelector('.menu__input');
            menuInput.checked = false;
        }
    })
};

const changeSelectedMenuItem = (element) => {
    document.querySelector('.menu__item_active').classList.remove('menu__item_active');
    element.classList.add('menu__item_active');
};

const createCardsByCategoryName = (categoryName) => {
    const category = categories.find(category => category.title === categoryName);
    const renderedCards = category.cards.map(card => new Card(card).render());
    const main = document.querySelector('.main');
    setHeaderTitle(categoryName);

    main.innerHTML = '';
    renderedCards.forEach(card => {
        main.innerHTML += card;
    });

    initCards(main);
};

const setHeaderTitle = (title) => {
    const headerTitle = document.querySelector('.header__title');
    headerTitle.textContent = title;
};

const initCards = (main) => {
    main.addEventListener('click', (e) => {
        const target = e.target;
        console.log(target);
        if (target.classList.contains('card__rotate')) {
            const card = target.closest('.card');
            card.classList.add('card_translate');
            card.addEventListener('mouseout', () => {
                card.classList.remove('card_translate');
            });
        } else if (target.classList.contains('card__front')) {
            new Audio(target.getAttribute('data-audio')).autoplay = true;
        }
    });
};
