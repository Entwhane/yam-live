import React, { useState, useContext, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";
import Dice from "./dice.component";

const PlayerDeck = (props) => {
    
    const { bot } = props
    const socket = useContext(SocketContext);
    const [displayPlayerDeck, setDisplayPlayerDeck] = useState(false);
    const [displayDeck, setDisplayDeck] = useState(false);
    const [dices, setDices] = useState(Array(5).fill(false));
    const [displayRollButton, setDisplayRollButton] = useState(false);
    const [rollsCounter, setRollsCounter] = useState(0);
    const [rollsMaximum, setRollsMaximum] = useState(3);

    useEffect(() => {

        socket.on("game.deck.view-state", (data) => {
            setDisplayPlayerDeck(data['displayPlayerDeck']);
            setDisplayDeck(data['displayDecks']);
            if (data['displayPlayerDeck'] && data['displayDecks']) {
                setDisplayRollButton(data['displayRollButton']);
                setRollsCounter(data['rollsCounter']);
                setRollsMaximum(data['rollsMaximum']);
                setDices(data['dices']);
            }
        });
    }, []);

    const toggleDiceLock = (index) => {
        const newDices = [...dices];
        if (newDices[index].value !== '' && displayRollButton) {
            socket.emit("game.dices.lock", newDices[index].id, bot);
        }
    };

    const rollDices = () => {
        if (rollsCounter <= rollsMaximum) {
            socket.emit("game.dices.roll", bot);
        }
    };

    return (
        <>
            {displayPlayerDeck && displayDeck && (
                <View style={styles.deckPlayerContainer}>
                    <>
                        {displayRollButton && (
                            <>
                                <View style={styles.rollInfoContainer}>
                                    <Text style={styles.rollInfoText}>
                                        Lancer {rollsCounter} / {rollsMaximum}
                                    </Text>
                                </View>
                            </>
                        )}

                        <View style={styles.diceContainer}>
                            {dices.map((diceData, index) => (
                                <Dice
                                    bot={bot}
                                    key={`diceData.id-${index}`}
                                    index={index}
                                    locked={diceData.locked}
                                    value={diceData.value}
                                    onPress={toggleDiceLock}
                                />
                            ))}
                        </View>

                        {displayRollButton && (
                            <>
                                <TouchableOpacity style={styles.rollButton} onPress={rollDices}>
                                    <Text style={styles.rollButtonText}>Lancer les dés</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    deckPlayerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "black"
    },
    rollInfoContainer: {
        marginBottom: 10,
    },
    rollInfoText: {
        color: 'white',
        fontSize: 14,
        fontStyle: "italic",
    },
    diceContainer: {
        flexDirection: "row",
        width: "70%",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    rollButton: {
        width: "40%",
        backgroundColor: "green",
        paddingVertical: 5,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#90AF4F"
    },
    rollButtonText: {
        fontSize: 16,
        color: "white",
        fontWeight: "bold",
    },
});

export default PlayerDeck;