export class ButtonPanel {
    constructor() {
    }

    render() {
        let template = '\n<div class="main__buttons">';
        template += '\n<button class="button button_hidden">Start Game</button>';
        template += '\n</div>';

        return template;
    }
}
