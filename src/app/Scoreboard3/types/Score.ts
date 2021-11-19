import { GameState, GameType, Team } from ".";
export interface Score {
    gameType: GameType,
    name: String,
    stamp: Date | number,
    state: GameState,
    teams: Team[],
    timer: number,
    gameMeta?: any,
}