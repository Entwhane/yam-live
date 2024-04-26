import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from 'react-native';
import { SocketContext } from "../../../contexts/socket.context";
import { useNavigation } from '@react-navigation/native';

const Result = () => {
    const socket = useContext(SocketContext);
    const navigation = useNavigation();
    const [result, setResult] = useState(null);

    useEffect(() => {
        socket.on("game.result", (data) => {
            setResult(data['gameResult'])
        });
    }, []);

    return (
        <>
            {result && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>{result}</Text>
                    <Button
                        title="Rejouer"
                        onPress={() => navigation.navigate('HomeScreen')}
                    />
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    resultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#1D1B1A"
    },
    resultText: {
        color: 'white'
    },
});

export default Result