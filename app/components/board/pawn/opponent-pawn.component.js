import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { SocketContext } from "../../../contexts/socket.context";

const OpponentPawns = () => {
    const socket = useContext(SocketContext);
    const [opponentPawns, setOpponentPawns] = useState(0);

    useEffect(() => {
        socket.on("game.pawns", (data) => {
            setOpponentPawns(data['opponentPawns'])
        });
    }, []);

    return (
        <View style={styles.opponentPawnsContainer}>
            <Text style={styles.opponentPawnsText}>Pions restant(s) : {opponentPawns}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    opponentPawnsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    opponentPawnsText: {
        color: 'white'
    }
});


export default OpponentPawns