import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { MaterialIcons } from '@expo/vector-icons';
const NetworkStatus: React.FC = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);

    useEffect(() => {
        const handleConnectivityChange = (state: NetInfoState) => {
            setIsConnected(state.isConnected);
        };
        NetInfo.fetch().then((state: NetInfoState) => {
            setIsConnected(state.isConnected);
        });
        const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
        return () => {
            unsubscribe();
        };
    }, [])


    return !isConnected && <Animated.View
        style={[
            styles.container
        ]}
    >
        <MaterialIcons
            name={'wifi-off'}
            size={24}
            color={'#721c24'}
        />
        <Text style={[styles.text, styles.offlineText]}>
            Offline
        </Text>
    </Animated.View>
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#f8d7da',
        justifyContent: 'center',
        width: '100%',
        height: 50,
        zIndex: 1000,
    },
    icon: {
        marginRight: 8,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    onlineText: {
        color: '#155724',
    },
    offlineText: {
        color: '#721c24',
    },
});

export default NetworkStatus;