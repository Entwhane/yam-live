import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { SocketContext } from "../../../contexts/socket.context";

const OpponentInfos = () => {
    // const socket = useContext(SocketContext);
    // const [opponentInfos, setOpponentInfos] = useState(0);

    // useEffect(() => {
    //     socket.on("game.timer", (data) => {
    //         setOpponentInfos(data['opponentInfos'])
    //     });
    // }, []);

    return (
        <View style={styles.opponentInfosContainer}>
            <Text style={styles.opponentInfosText}>Opponent infos</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    opponentInfosContainer: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'black',
        backgroundColor: "#1D1B1A"
    },
    opponentInfosText: {
        color: 'white'
    },
});

export default OpponentInfos