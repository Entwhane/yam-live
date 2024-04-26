import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View, Button, ActivityIndicator } from "react-native";
import { SocketContext } from '../contexts/socket.context';
import Board from "../components/board/board.component";

export default function BotGameController() {

    const socket = useContext(SocketContext);
    const [inQueue, setInQueue] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [idOpponent, setIdOpponent] = useState(null);

    useEffect(() => {
        console.log('[emit][bot.join]:', socket.id);
        setInGame(false);
        socket.emit("bot.join");
        socket.on('game.start', (data) => {
            console.log('[listen][game.start]:', data);
            setInGame(data['inGame']);
            setIdOpponent(data['idOpponent']);
        });
    }, []);

    return (
        <View style={styles.container}>
            {!inGame && (
                <>
                    <Text style={styles.paragraph}>
                        Waiting for server datas...
                    </Text>
                </>
            )}

            {inGame && (
                <>
                    <Board bot={true}/>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#302E2B",
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
    },
    paragraph: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 30
    }
});