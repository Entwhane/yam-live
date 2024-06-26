import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Dice = ({ index, locked, value, onPress, opponent }) => {

    const handlePress = () => {
        if (!opponent) {
            onPress(index);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.dice, locked && value ? styles.lockedDice : styles.initDice]}
            onPress={handlePress}
            disabled={opponent}
        >
            <Text style={styles.diceText}>{value}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    dice: {
        width: 35,
        height: 35,
        backgroundColor: "white",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    lockedDice: {
        backgroundColor: "gray",
    },
    initDice: {
        backgroundColor: "white",
    },
    diceText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    opponentText: {
        fontSize: 12,
        color: "red",
    },
});

export default Dice;