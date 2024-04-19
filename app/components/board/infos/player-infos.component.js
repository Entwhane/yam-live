import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { SocketContext } from "../../../contexts/socket.context";

const PlayerInfos = () => {
    // const socket = useContext(SocketContext);
    // const [playerInfos, setPlayerInfos] = useState(0);

    // useEffect(() => {
    //     socket.on("game.timer", (data) => {
    //         setPlayerInfos(data['playerInfos'])
    //     });
    // }, []);

    return (
        <View style={styles.playerInfosContainer}>
            <Text style={styles.playerInfosText}>Player Infos</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    playerInfosContainer: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'black',
        backgroundColor: "#1D1B1A"
    },
    playerInfosText: {
        color: 'white'
    },
});

export default PlayerInfos