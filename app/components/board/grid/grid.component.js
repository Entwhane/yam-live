import React, { useEffect, useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";

const Grid = (props) => {

    const { bot } = props
    const socket = useContext(SocketContext);
    const [displayGrid, setDisplayGrid] = useState(true);
    const [canSelectCells, setCanSelectCells] = useState([]);
    const [grid, setGrid] = useState(
        Array(5).fill().map(() => Array(5).fill().map(() => (
            { viewContent: '', id: '', owner: null, canBeChecked: false }
        ))
        ));

    const handleSelectCell = (cellId, rowIndex, cellIndex) => {
        if (canSelectCells) {
            socket.emit("game.grid.selected", { cellId, rowIndex, cellIndex }, bot);
        }
    };

    useEffect(() => {
        socket.on("game.grid.view-state", (data) => {
            setDisplayGrid(data['displayGrid']);
            setCanSelectCells(data['canSelectCells'])
            setGrid(data['grid']);
        });
    }, []);

    return (
        <View style={styles.gridContainer}>
            {displayGrid &&
                grid.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((cell, cellIndex) => (
                            <TouchableOpacity
                                key={`${cell.id}-${cellIndex}`}
                                style={styles.cell}
                                onPress={() => handleSelectCell(cell.id, rowIndex, cellIndex)}
                                disabled={!cell.canBeChecked}
                            >
                                <View style={[
                                    styles.insideCell,
                                    (cellIndex + rowIndex) % 2 == 0 ? styles.greenCell : styles.beigeCell,
                                    cell.owner === "player:1" && styles.playerOwnedCell,
                                    cell.owner === "player:2" && styles.opponentOwnedCell,
                                    (cell.canBeChecked && !(cell.owner === "player:1") && !(cell.owner === "player:2")) && styles.canBeCheckedCell,
                                ]}>
                                    <Text style={(cellIndex + rowIndex) % 2 == 0 ? styles.cellText : styles.beigeCellText}>{cell.viewContent}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        flex: 5,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        paddingRight: 20
    },
    row: {
        flexDirection: "row",
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    cell: {
        flexDirection: "row",
        flex: 2,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    insideCell: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    cellText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    playerOwnedCell: {
        backgroundColor: "lightgreen",
        opacity: 0.9,
    },
    opponentOwnedCell: {
        backgroundColor: "lightcoral",
        opacity: 0.9,
    },
    canBeCheckedCell: {
        width: "90%",
        height: "90%",
    },
    topBorder: {
        borderTopWidth: 1,
    },
    leftBorder: {
        borderLeftWidth: 1,
    },
    greenCell: {
        backgroundColor: '#90AF4F'
    },
    beigeCell: {
        backgroundColor: '#EDEDD1',
        color: 'black'
    },
    beigeCellText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#000000'
    }
});

export default Grid;