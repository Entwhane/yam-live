import React, { useContext, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from 'react-native';
import { SocketContext } from "../../../contexts/socket.context";

const OpponentInfos = () => {
    return (
        <View style={styles.opponentInfosContainer}>
            <Image
                style={styles.stretch}
                source={require('../../../image/utilisateur.png')}
            />
            <Text style={styles.opponentInfosText}>Joueur 2</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    opponentInfosContainer: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'black',
        backgroundColor: "#1D1B1A",
        flexDirection: 'row'
    },
    opponentInfosText: {
        color: 'white',
        padding: 20,
    },
    stretch: {
        width: 50,
        height: 50,
        resizeMode: 'stretch',
    },
});

export default OpponentInfos