import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";
import Dice from "./dice.component";

const OpponentDeck = () => {
    const socket = useContext(SocketContext);
    const [displayOpponentDeck, setDisplayOpponentDeck] = useState(false);
    const [displayDeck, setDisplayDeck] = useState(false);
    const [opponentDices, setOpponentDices] = useState(Array(5).fill({ value: "", locked: false }));

    useEffect(() => {
        socket.on("game.deck.view-state", (data) => {
            setDisplayOpponentDeck(data['displayOpponentDeck']);
            setDisplayDeck(data['displayDecks']);
            if (data['displayOpponentDeck'] && data['displayDecks']) {
                setOpponentDices(data['dices']);
            }
        });
    }, []);

    return (
        <>
            {displayOpponentDeck && displayDeck && (
                <View style={styles.deckOpponentContainer}>
                    <View style={styles.diceContainer}>
                        {opponentDices.map((diceData, index) => (
                            <Dice
                                key={index}
                                locked={diceData.locked}
                                value={diceData.value}
                                opponent={true}
                            />
                        ))}
                    </View>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    deckOpponentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "black"
    },
    diceContainer: {
        flexDirection: "row",
        width: "70%",
        justifyContent: "space-between",
        marginBottom: 10,
    },
});

export default OpponentDeck;