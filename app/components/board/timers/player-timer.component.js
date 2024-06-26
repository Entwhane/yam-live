import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { SocketContext } from "../../../contexts/socket.context";

const PlayerTimer = () => {
    const socket = useContext(SocketContext);
    const [playerTimer, setPlayerTimer] = useState(0);

    useEffect(() => {
        socket.on("game.timer", (data) => {
            setPlayerTimer(data['playerTimer'])
        });
    }, []);

    return (
        <View style={styles.playerTimerContainer}>
            <Text style={styles.playerTimerText}>Temps restant : {playerTimer}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    playerTimerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playerTimerText: {
        color: 'white'
    }
});


export default PlayerTimer