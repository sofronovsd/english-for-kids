export class Star {
    constructor(isWin) {
        this.isWin = isWin;
    }

    render() {
        let template = `\n<div class="star ${this.isWin ? "star_win" : ""}">`;
        template += '\n</div>';

        return template;
    }
}
