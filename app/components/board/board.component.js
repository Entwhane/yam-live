import React from "react";
import { View, StyleSheet } from 'react-native';
import OpponentTimer from "./timers/opponent-timer.component";
import PlayerTimer from "./timers/player-timer.component";
import PlayerDeck from "./decks/player-deck.component";
import OpponentDeck from "./decks/opponent-deck.component";
import Choices from "./choices/choices.component";
import Grid from "./grid/grid.component";
import PlayerScore from "./score/player-score.component";
import OpponentScore from "./score/opponent-score.component";
import PlayerInfos from "./infos/player-infos.component";
import OpponentInfos from "./infos/opponent-infos.component";
import PlayerPawns from "./pawn/player-pawn.component";
import OpponentPawns from "./pawn/opponent-pawn.component";
import Result from "./result/result.component";

const Board = ({ gameViewState }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.row, { height: '10%' }]}>
                <OpponentInfos />
                <View style={styles.opponentTimerScoreContainer}>
                    <OpponentTimer />
                    <OpponentPawns />
                    <OpponentScore />
                </View>
            </View>
            <View style={[styles.row, { height: '22%' }]}>
                <OpponentDeck />
            </View>
            <View style={[styles.row, styles.gridContainer, { height: '36%' }]}>
                <Grid />
                <Choices />
            </View>
            <View style={[styles.row, { height: '22%' }]}>
                <PlayerDeck />
                <Result />
            </View>
            <View style={[styles.row, { height: '10%' }]}>
                <PlayerInfos />
                <View style={styles.playerTimerScoreContainer}>
                    <PlayerTimer />
                    <PlayerPawns />
                    <PlayerScore />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#302E2B'
    },
    row: {
        flexDirection: 'row',
        width: '100%',
    },
    opponentTimerScoreContainer: {
        flex: 4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#1D1B1A"
    },
    gridContainer: {
        paddingHorizontal: 20
    },
    playerTimerScoreContainer: {
        flex: 4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#1D1B1A"
    },
});

export default Board;