export class MenuItem {
    constructor(text) {
        this.text = text;
    }

    render() {
        let template = `\n<li>`;
        template += `\n<a class="menu__item" href="#">${this.text}</a>`;
        template += `\n</li>`;

        return template;
    }
}
