import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useStockStore } from '@/store/stock.store';



export default function FilterActions() {

    const search = useStockStore((state) => state.setQuerySearch);
    const sort = useStockStore((state) => state.setQuerySort);


    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Search" onChangeText={search} />
            <TouchableOpacity onPress={() => sort('asc')}>
                <AntDesign name="arrowdown" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sort('desc')}>
                <AntDesign name="arrowup" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between',
      
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 10,
        flex: 0.9,
        fontSize: 16,
    },
});
