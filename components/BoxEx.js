import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text,
     Image, Platform, Vibration, TouchableWithoutFeedback,
     Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useState, useEffect } from 'react';

// status, level, highScore, quiz, isDisabled
//, navigation
const BoxEx = (props) => {
    const bgColors = [
        '#F6D1AB',
        '#E14242',
        '#2E9A6D',
    ];
    const textColors = [
        '#FAEAD9',
        '#642900',
    ]

    const statusContents = [
        'Chưa hoàn thành',
        'Đã đạt: ',
    ];

    const actions = [
        'BẮT ĐẦU',
        'LÀM LẠI',
    ];

    const [textColor, settextColor] = useState('#FAEAD9');
    const [bgColor, setbgColor] = useState('#F6D1AB');
    const [statusContent, setstatusContent] = useState('Chưa hoàn thành');
    const [action, setaction] = useState('BẮT ĐẦU');
    
    const imgSource = `https://lehuubao1810.github.io/dataquiz/lv${props.level}.png`

    React.useEffect(() => {
        setbgColor(bgColors[props.status]);
        if(props.status == 0) {
            settextColor(textColors[1]);
            setstatusContent(statusContents[0]);
            setaction(actions[0]);
        } else {
            settextColor(textColors[0]);
            setstatusContent(statusContents[1] + props.highScore);
            setaction(actions[1]);
        }
    }, [props.status]);

    return ( 
        <>
            <TouchableOpacity disabled={props.isDisable} style={[styles.boxExercise, {backgroundColor: bgColor }]}
                onPress={() => {props.navigation.navigate( 'Quiz', 
                    { 
                        level: props.level,
                        questions: props.questions,
                        time : props.time,
                        highScore: props.highScore,
                        status: props.status,
                        id : props.id,
                        quizsLength: props.quizsLength,
                    }
                );
                props.playSoundTouch();}}
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
            >
                {
                props.isDisable ? 
                <TouchableWithoutFeedback 
                    onPress={() => {
                        Vibration.vibrate()
                        props.setModalVisible(true);
                        props.playSoundLock();
                    }}
                >
                    <View style={styles.locked}>
                        <Icon name="lock" size={50} color="#EC8944"/>
                    </View>
                </TouchableWithoutFeedback> 
                : null
                }
                <View style={styles.boxExerciseItem}>
                    <Image source={{uri: imgSource}} style={styles.star}/>
                    
                    <View style={styles.boxExerciseItemContent}>
                        <Text style={[
                            styles.text35Dark,
                            styles.level, 
                            {color: textColor }
                            ]}
                        >Cấp độ {props.level}</Text>
                        <Text style={[styles.text25Dark,{color: textColor }]}>
                            {statusContent}
                        </Text>
                    </View>
                </View>
                <View style={styles.boxExerciseItem}>
                    <Text style={[styles.text25Dark, {color: textColor }]}>{action}</Text>
                    <Icon name="chevron-right" size={30} color={textColor} />
                </View>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    star: {
        width: 50,
        height: 50,
    },
    // boxExercise
    boxExercise: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 100,
        borderRadius: 20,
        paddingRight: 20,
        paddingLeft: 10,
        marginBottom: 20,
        position: 'relative',
    },
    boxExerciseItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    boxExerciseItemContent: {
        marginLeft: 15,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    level: {
        paddingBottom: 15,
    },
    text25Light: {
        color: '#FAEAD9',
        fontWeight: 'bold',
    },
    text35Light: {
        color: '#FAEAD9',
        fontWeight: 'bold',
        fontSize: 18,
    },
    text25Dark: {
        color: '#642900',
        fontWeight: 'bold',
        marginRight: 5,
    },
    text35Dark: {
        color: '#642900',
        fontWeight: 'bold',
        fontSize: 18,
    },
    locked: {
        position: 'absolute',
        zIndex: 1,
        width: '111%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});

export default BoxEx;