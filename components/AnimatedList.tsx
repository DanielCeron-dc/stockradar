import React, { useCallback } from 'react';
import type { FlatListProps, ListRenderItemInfo, ListRenderItem } from 'react-native';
import { FlatList, View } from 'react-native';
import Animated, { SlideInDown,  FadeIn } from 'react-native-reanimated';

interface IProps<T> extends FlatListProps<T> {
    renderItem: ListRenderItem<T>;
    ItemSeparatorComponent?: () => React.ReactElement;
}

function AnimatedList<T>({
    renderItem,
    ItemSeparatorComponent,
    ...props
}: IProps<T>): React.ReactElement {


    const renderAnimatedItem = useCallback(
        ({ item, index }: ListRenderItemInfo<T>) => {
            const isLast = index === (props.data?.length ?? 0) - 1;

            return (
                <View>
                    <Animated.View
                        entering={SlideInDown.delay(index * 100).duration(300)}
                    >
                        {renderItem({ item, index } as ListRenderItemInfo<T>)}
                    </Animated.View>
                    {!isLast && ItemSeparatorComponent && (
                        <Animated.View
                            entering={FadeIn.delay(index * 100 + 300).duration(700)}
                        >
                            {ItemSeparatorComponent()}
                        </Animated.View>
                    )}
                </View>
            );
        },
        [renderItem, ItemSeparatorComponent]
    );

    return (
        <FlatList
            {...props}
            // do NOT pass ItemSeparatorComponent here
            renderItem={renderAnimatedItem}
            initialNumToRender={10}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={21}
            updateCellsBatchingPeriod={50}
            showsVerticalScrollIndicator={false}
        />
    );
}

export default AnimatedList;