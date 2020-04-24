export class Card {
    constructor({word, translation, image, audioSrc}) {
        this.word = word;
        this.translation = translation;
        this.image = image;
        this.audioSrc = audioSrc;
    }

    render() {
        return `<div class="card">\n` +
            `<div class="card__front" data-audio="${this.audioSrc}" style="background-image: url(${this.image})">\n` +
            `<div class="card__title">${this.word}</div>\n` +
            `</div>\n` +
            `<div class="card__back" style="background-image: url(${this.image})">\n` +
            `<div class="card__title">${this.translation}</div>\n` +
            `</div>\n` +
            `<div class="card__rotate"></div>\n` +
            `</div>\n`;
    }

}
