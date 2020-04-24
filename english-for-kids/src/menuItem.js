export class MenuItem {
    constructor(text) {
        this.text = text;
    }

    render() {
        return `<li>\n
            <a class="menu__item" href="#">${this.text}</a>\n
            </li>\n`;
    }
}
