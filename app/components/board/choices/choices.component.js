import React, { useState, useContext, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";

const Choices = (props) => {
    
    const { bot } = props
    const socket = useContext(SocketContext);
    const [displayChoices, setDisplayChoices] = useState(false);
    const [canMakeChoice, setCanMakeChoice] = useState(false);
    const [idSelectedChoice, setIdSelectedChoice] = useState(null);
    const [availableChoices, setAvailableChoices] = useState([]);

    const MAP_CHOICES = {
        '': '',
        '': '',
        '': '',
        '': '',
        '': '',
        '': '',
        '': '',
    }

    useEffect(() => {

        socket.on("game.choices.view-state", (data) => {
            setDisplayChoices(data['displayChoices']);
            setCanMakeChoice(data['canMakeChoice']);
            setIdSelectedChoice(data['idSelectedChoice']);
            setAvailableChoices(data['availableChoices']);
        });

    }, []);

    const handleSelectChoice = (choiceId) => {
        if (canMakeChoice) {
            setIdSelectedChoice(choiceId);
            socket.emit("game.choices.selected", { choiceId }, bot);
        }
    };

    return (
        <View style={styles.choicesContainer}>
            {displayChoices &&
                availableChoices.map((choice) => (
                    <TouchableOpacity
                        key={choice.id}
                        style={[
                            styles.choiceButton,
                            idSelectedChoice === choice.id && styles.selectedChoice,
                            !canMakeChoice && styles.disabledChoice
                        ]}
                        onPress={() => handleSelectChoice(choice.id)}
                        disabled={!canMakeChoice}
                    >
                        <Text style={idSelectedChoice === choice.id ? styles.selectedChoiceText : styles.choiceText}>{choice.value}</Text>
                    </TouchableOpacity>
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    choicesContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#262522",
        borderRadius: 5
    },
    choiceButton: {
        backgroundColor: "white",
        borderRadius: 5,
        marginVertical: 5,
        alignItems: "center",
        justifyContent: "center",
        width: "85%",
        height: "10%"
    },
    selectedChoice: {
        backgroundColor: "#90AF4F",
    },
    selectedChoiceText: {
        color: 'white',
        fontSize: 13,
        fontWeight: "bold",
    },
    choiceText: {
        fontSize: 13,
        fontWeight: "bold",
    },
    disabledChoice: {
        opacity: 0.5,
    },
});

export default Choices;