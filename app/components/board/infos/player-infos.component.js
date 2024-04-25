import React, { useContext, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from 'react-native';
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
            <Image
                style={styles.stretch}
                source={require('../../../image/utilisateur.png')}
            />
            <Text style={styles.playerInfosText}>Joueur 1</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    playerInfosContainer: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'black',
        backgroundColor: "#1D1B1A",
        flexDirection: 'row'
    },
    playerInfosText: {
        color: 'white',
        padding: 20,
    },
    stretch: {
        width: 50,
        height: 50,
        resizeMode: 'stretch',
    },
});

export default PlayerInfos