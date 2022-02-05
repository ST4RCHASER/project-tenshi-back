import { GameState, GameType, Team, TimerState } from ".";
export interface Score {
    id: string,
    gameType: GameType,
    name: String,
    stamp: Date | number,
    state: GameState,
    teams: Team[],
    timer: number,
    gameMeta?: any,
    timerState: TimerState
}