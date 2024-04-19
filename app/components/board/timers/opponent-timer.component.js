import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { SocketContext } from "../../../contexts/socket.context";

const OpponentTimer = () => {
    const socket = useContext(SocketContext);
    const [opponentTimer, setOpponentTimer] = useState(0);

    useEffect(() => {
        socket.on("game.timer", (data) => {
            setOpponentTimer(data['opponentTimer'])
        });
    }, []);

    return (
        <View style={styles.opponentTimerContainer}>
            <Text style={styles.opponentTimerText}>Temps restant : {opponentTimer}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    opponentTimerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    opponentTimerText: {
        color: 'white'
    }
});


export default OpponentTimer