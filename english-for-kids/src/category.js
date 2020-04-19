export class Category {
    constructor({title, image, cards}) {
        this.title = title;
        this.image = image;
        this.cards = cards;
    }

    render() {
        let template = '\n<a class="main-card main-card_green">';
        this.image && (template += `\n<img src="${this.image}" alt="${this.title}">`);
        template += `\n${this.title}`;
        template += '\n</a>';

        return template;
    }

}
