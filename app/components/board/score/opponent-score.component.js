import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { SocketContext } from "../../../contexts/socket.context";

const OpponentScore = () => {
    // const socket = useContext(SocketContext);
    // const [opponentScore, setOpponentScore] = useState(0);

    // useEffect(() => {
    //     socket.on("game.timer", (data) => {
    //         setOpponentScore(data['opponentScore'])
    //     });
    // }, []);

    return (
        <View style={styles.opponentScoreContainer}>
            <Text style={styles.opponentScoreText}>Score : </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    opponentScoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#1D1B1A"
    },
    opponentScoreText: {
        color: 'white'
    },
});

export default OpponentScore