'use strict';

/**
 * Поиск кнопки "старт анимации"
 */
const btnStartAnimation = document.querySelector('.task6_button__start-animation')

/**
 * Поиск кнопки "изменения цвета"
 */
const btnChangeColor = document.querySelector('.task6_button__change-icon-color')

/**
 * Поиск иконки
 */
const icon = document.querySelector('.task6_icon')

/**
 * Поиск элемента path в иконке для изменения цвета
 */
const path = document.querySelector('.path')

/**
 * Палитра цветов для иконки
 */
const colors = [
    '#FD9191',
    '#DFFF9B',
    '#94CBFF',
    '#0066FF'
]

/**
 * callback старта анимации
 */
const startAnimation = () => {
    icon.classList.add('task6_icon__jump')
}

/**
 * Вешаем обработчик слушателя по клику на кнопку "старт анимации"
 */
const handleStartAnimation = () => {
    btnStartAnimation.addEventListener('click',
        startAnimation
    )
}

/**
 * Если на странице имеется кнопка "старт анимации",
 * то запускаем функцию для прослушки клика по кнопке
 */
if (btnStartAnimation) {
    handleStartAnimation()
}


/**
 * callback изменения цвета.
 * Функцией random() получаем рандомное число от 0 до 3,
 * Изменияем fill иконки из массива colors по индексу из
 * рандомного числа
 */
const changeColor = () => {
    const random = () => {
        return Math.floor(Math.random() * 4);
    }
    random()
    path.style.fill = colors[random()]
}

/**
 * Вешаем обработчик слушателя по клику на кнопку "изменения цвета"
 */
const handleChangeColor = () => {
    btnChangeColor.addEventListener('click',
        changeColor
    )
}

/**
 * Если на странице имеется кнопка "изменения цвета",
 * то запускаем функцию для прослушки клика по кнопке
 */
if (btnChangeColor) {
    handleChangeColor()
}