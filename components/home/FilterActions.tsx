import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useStockStore } from '@/store/stock.store';
import { useThemeColor } from '@/hooks/useThemeColor';



export default function FilterActions() {

    const search = useStockStore((state) => state.setQuerySearch);
    const sort = useStockStore((state) => state.setQuerySort);
    const color = useThemeColor({ }, 'text');


    return (
        <View style={styles.container}>
            <TextInput style={[styles.input, { borderColor: color , color}]} placeholder="Search" onChangeText={search} />
            <TouchableOpacity onPress={() => sort('asc')}>
                <AntDesign name="arrowdown" size={24} color={color} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sort('desc')}>
                <AntDesign name="arrowup" size={24} color={color}/>
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
        borderRadius: 5,
        padding: 10,
        flex: 0.9,
        fontSize: 16,
    },
});
