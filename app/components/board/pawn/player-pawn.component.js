import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { SocketContext } from "../../../contexts/socket.context";

const PlayerPawns = () => {
    const socket = useContext(SocketContext);
    const [playerPawns, setPlayerPawns] = useState(0);

    useEffect(() => {
        socket.on("game.pawns", (data) => {
            setPlayerPawns(data['playerPawns'])
        });
    }, []);

    return (
        <View style={styles.playerPawnsContainer}>
            <Text style={styles.playerPawnsText}>Pions restant(s) : {playerPawns}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    playerPawnsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playerPawnsText: {
        color: 'white'
    }
});


export default PlayerPawns