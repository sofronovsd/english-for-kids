export class Card {
    constructor({word, translation, image, audioSrc}) {
        this.word = word;
        this.translation = translation;
        this.image = image;
        this.audioSrc = audioSrc;
    }

    render() {
        let template = `\n<div class="card">`;
        template += `\n<div class="card__front" data-audio="${this.audioSrc}" style="background-image: url(${this.image})">`;
        template += `\n<div class="card__title">${this.word}</div>`;
        template += `\n</div>`;
        template += `\n<div class="card__back" style="background-image: url(${this.image})">`;
        template += `\n<div class="card__title">${this.translation}</div>`;
        template += `\n</div>`;
        template += `\n<div class="card__rotate"></div>`;
        template += `\n</div>`;

        return template;
    }

}
