// app/screens/home.screen.js
import { StyleSheet, View, TouchableOpacity, Text, Button, Image } from "react-native";

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={{
                padding: 20,
                alignItems: "center",
                justifyContent: "center",
            }}>
                <View style={{
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Text style={styles.test}>Play Yam Master Online on the #1 Site!</Text>
                </View>
                <View style={{ width: '80%' }}>
                    <TouchableOpacity style={styles.onlineButton} onPress={() => navigation.navigate('OnlineGameScreen')}>
                        <View style={[styles.row, { width: '100%' }]}>
                            <View style={[styles.row, { width: '30%', justifyContent: 'center', alignItems: 'center' }]}>
                                <Image
                                    style={styles.stretch}
                                    source={require('../image/cube-de-des.png')}
                                />
                            </View>
                            <View style={[styles.column, { width: '70%', padding: 10 }]}>
                                <Text style={styles.onlineButtonText}>Jouer en ligne</Text>
                                <Text style={styles.onlineButtonTextInfo}>Jouer avec vos amis</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ width: '80%' }}>
                    <TouchableOpacity style={styles.botButton} onPress={() => navigation.navigate('VsBotGameScreen')}>
                        <View style={[styles.row, { width: '100%' }]}>
                            <View style={[styles.row, { width: '30%', justifyContent: 'center', alignItems: 'center' }]}>
                                <Image
                                    style={styles.stretch}
                                    source={require('../image/bot.png')}
                                />
                            </View>
                            <View style={[styles.column, { width: '70%', padding: 10 }]}>
                                <Text style={styles.onlineButtonText}>Jouer contre le bot</Text>
                                <Text style={styles.onlineButtonTextInfo}>Joueur contre l'IA</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#302E2B",
        alignItems: "center",
        justifyContent: "center",
    },
    row: {
        flexDirection: 'row',
        width: '100%',
    },
    column: {
        flexDirection: 'column',
        width: '100%',
    },
    onlineButton: {
        backgroundColor: "green",
        paddingVertical: 10,
        marginVertical: 25,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#80B64B",
    },
    botButton: {
        backgroundColor: "green",
        paddingVertical: 10,
        marginVertical: 25,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#51504C",
    },
    onlineButtonText: {
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
        padding: 2
    },
    onlineButtonTextInfo: {
        fontSize: 11,
        color: "white",
        padding: 2
    },
    test: {
        color: "white",
        fontSize: 36,
        fontWeight: 700,
        padding: 0,
        textAlign: 'center'
    },
    stretch: {
        width: 50,
        height: 50,
        resizeMode: 'stretch',
    },
});