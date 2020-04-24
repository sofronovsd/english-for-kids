export class Star {
    constructor(isWin) {
        this.isWin = isWin;
    }

    render() {
        return `<div class="star ${this.isWin ? "star_win" : ""}">\n
            </div>\n`;
    }
}
