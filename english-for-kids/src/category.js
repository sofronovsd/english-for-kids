export class Category {
    constructor({title, image, cards}) {
        this.title = title;
        this.image = image;
        this.cards = cards;
    }

    render() {
        let template = '<a class="main-card main-card_green">\n';
        this.image && (template += `<img src="${this.image}" alt="${this.title}">\n`);
        template += `${this.title}\n` +
            `</a>\n`;

        return template;
    }

}
