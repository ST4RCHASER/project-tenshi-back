import { GameState } from "../types";
import { Game } from "./Game";
export class FootBall extends Game {
    part: FootBallPart = 0;
    countdown: number = 0;
    enable_countdown: boolean = false;
    super() {
        let inrerval = setInterval(() => {
            if (this.enable_countdown) {
                this.countdown--;
                if (this.countdown <= 0) {
                    this.enable_countdown = false;
                    if (this.part == FootBallPart.FIRST_HALF) {
                        this.part = FootBallPart.SECOND_HALF;
                        this.enable_countdown = false;
                    } else if (this.part == FootBallPart.SECOND_HALF) {
                        this.setState(GameState.ENDED);
                        this.enable_countdown = false;
                    }
                }
            }
        }, 1000)
    }
    isCountingDown() {
        return this.enable_countdown;
    }
    getCountdownTimer() {
        return this.countdown;
    }
    setCountdownTimer(newCountdown: number) {
        this.countdown = newCountdown;
        return this;
    }
    setCountdown(newCountdown: boolean) {
        this.enable_countdown = newCountdown;
        return this;
    }
    setPart(newPart: FootBallPart) {
        this.part = newPart;
        return this;
    }
    getPart() {
        return this.part;
    }
}
enum FootBallPart {
    FIRST_HALF = 0,
    SECOND_HALF = 1,
}