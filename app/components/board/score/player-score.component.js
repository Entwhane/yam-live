import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { SocketContext } from "../../../contexts/socket.context";

const PlayerScore = () => {
    // const socket = useContext(SocketContext);
    // const [playerScore, setPlayerScore] = useState(0);

    // useEffect(() => {
    //     socket.on("game.timer", (data) => {
    //         setPlayerScore(data['playerScore'])
    //     });
    // }, []);

    return (
        <View style={styles.playerScoreContainer}>
            <Text style={styles.playerScoreText}>Score : </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    playerScoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#1D1B1A"
    },
    playerScoreText: {
        color: 'white'
    },
});

export default PlayerScore