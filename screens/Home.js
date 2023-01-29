import * as React from 'react';
import { StyleSheet, Button, View, Text, 
    Image, TouchableOpacity, ScrollView, 
    SafeAreaView, StatusBar, ActivityIndicator,
    Animated, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BoxEx from '../components/BoxEx';

import { Audio } from 'expo-av';

function HomeScreen({ navigation }) {

    const [quizs, setQuizs] = useState([]);
    // const [quizsReview, setQuizsReview] = useState([]);
    const [reviewData, setReviewData] = useState([]);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetch('https://dataquizapp.glitch.me/reviewData')
            .then((response) => response.json())
            .then((json) => setReviewData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading1(false));

        fetch('https://dataquizapp.glitch.me/quizsLevels')
            .then((response) => response.json())
            .then((json) => setQuizs(json))
            .catch((error) => console.error(error))
            .finally(() => {
                setLoading2(false);
            });
    }, []);

    const [sound, setSound] = useState();
    async function playSoundTouch() {
        const { sound } = await Audio.Sound.createAsync( require(`../assets/sounds/touch.mp3`));
        setSound(sound);
        await sound.playAsync();
    }
    async function playSoundLock() {
        const { sound } = await Audio.Sound.createAsync( require(`../assets/sounds/wrong.mp3`));
        setSound(sound);
        await sound.playAsync();
    }
    useEffect(() => {
        return sound
          ? () => {
              sound.unloadAsync();
            }
          : undefined;
    }, [sound]);

    
    // Average score
    let avgScore = 10;
    const statisticalLevelArr = Object.keys(quizs).map((key) => {
        return quizs[key].status;
    });
    const statisticalLevel = statisticalLevelArr.filter((item) => item > 0).length;
    const highScoreArr = [];
    for (let i = 0; i < quizs.length; i++) {
        if(quizs[i].status > 0) {
            highScoreArr.push(quizs[i].highScore);
        }
    }
    if (highScoreArr.length > 0) {
        avgScore = (highScoreArr.reduce((a, b) => a + b, 0) / highScoreArr.length).toFixed(0);
    } else {
        avgScore = 10;
    }

    //get questions from quizs
    const arrQuestion = [];
    for (let i = 0; i < quizs.length; i++) {
        if (quizs[i].status > 0) {
            arrQuestion.push(...quizs[i].questions);
        }
    }
    // random 10 questions from arrQuestion 
    const arrQuestionRandom = [];
    for (let i = 0; i < 10; i++) {
        const random = Math.floor(Math.random() * arrQuestion.length);
        arrQuestionRandom.push(arrQuestion[random]);
        arrQuestion.splice(random, 1);
    }
    let quizsReview=[
        {
            "question": "2 + 2 = ?",
            "options": ["1", "3", "2", "4"],
            "answer": "4"
        },
        {
            "question": "2 - 2 = ?",
            "options": ["1", "3", "2", "0"],
            "answer": "0"
        },
        {
            "question": "5 - 2 = ?",
            "options": ["3", "5", "2", "4"],
            "answer": "3"
        },
        {
            "question": "0 + 2 = ?",
            "options": ["2", "3", "7", "4"],
            "answer": "2"
        },
        {
            "question": "0 + 0 = ?",
            "options": ["5", "6", "0", "4"],
            "answer": "0"
        },
        {
            "question": "3 + 1 = ?",
            "options": ["8", "5", "3", "4"],
            "answer": "4"
        },
        {
            "question": "2 + 3 = ?",
            "options": ["5", "3", "2", "8"],
            "answer": "5"
        },
        {
            "question": "4 + 1 = ?",
            "options": ["1", "3", "5", "4"],
            "answer": "5"
        },
        {
            "question": "4 - 3 = ?",
            "options": ["1", "5", "2", "4"],
            "answer": "1"
        },
        {
            "question": "3 - 1 = ?",
            "options": ["1", "5", "2", "4"],
            "answer": "2"
        }
    ];
    if (arrQuestion.length >= 10) {
        quizsReview=arrQuestionRandom;
    }

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.titleHeader}>
                <View style={styles.title}>
                    <Image source={require('../assets/star.png')} style={styles.star}/>
                    <Text style={styles.titleText}>Xin chào</Text>
                </View>
                <Text style={styles.text35Tile}>Hãy bắt đầu làm bài nào ⚔</Text>
            </View>
            <Image source={require('../assets/splash.png')} style={styles.logo}/>
        </View>  

        {loading2 ? 
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#EC8944" />
            </View>
            :
        <View style={styles.statistical}>
            <View style={styles.statisticalItem}>
                <Image source={require('../assets/avg.png')} style={styles.star}/>
                <View style={styles.statisticalItemContent}>
                    <Text style={styles.text25Light}>Điểm trung bình</Text>
                    <Text style={styles.text35Light}>{statisticalLevel > 0 ? avgScore : 10}</Text>
                </View>
            </View>
            <View style={styles.statisticalItem}>
                <Image source={require('../assets/level.png')} style={styles.star}/>
                <View style={styles.statisticalItemContent}>
                    <Text style={styles.text25Light}>Cấp độ</Text>
                    <Text style={styles.text35Light}>{statisticalLevel}</Text>
                </View>
            </View>

        </View>
        }

        <View style={styles.review}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="hand-point-right" size={20} color="#900" />
                <Text style={[styles.text25Dark,{marginLeft: 5}]}>Ôn lại kiến thức</Text>
            </View>

            {loading1 ? 
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#EC8944" />
            </View>
            :
            
            <TouchableOpacity
                style={[styles.boxExercise, {backgroundColor: '#B09364' }]}
                onPress={() => {
                    navigation.navigate('Quiz', 
                        { 
                            level: false,
                            questions: quizsReview,
                            time: 20,
                            highScore: reviewData[0].recentScore,
                            // status: reviewData[0].status,
                            // id : reviewData.id,
                        }
                        );
                        playSoundTouch();
                    }
                }
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
            >
                <View style={styles.boxExerciseItem}>
                    <Image source={require('../assets/brain.png')} style={styles.star}/>
                    <View style={styles.boxExerciseItemContent}>
                        <Text style={[
                            styles.text35Light,
                            styles.level, 
                            ]}
                        >Câu hỏi tổng hợp</Text>
                        <Text style={[styles.text25Light]}>
                            Điểm đạt gần nhất: {reviewData[0].recentScore} điểm
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
            }
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="pencil-alt" size={20} color="#900" />
            <Text style={[styles.text25Dark,{marginLeft: 5}]}>Làm bài</Text>
        </View>
        

        <Modal
            animationType="pulse"
            transparent={true}
            visible={modalVisible}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Em cần hoàn thành các bài trước 
                        <Text style={{color:'#E14242'}}> trên 5 điểm</Text> để mở khóa bài này!
                    </Text>
                    <TouchableOpacity
                        style={styles.backHome}
                        activeOpacity={0.6}
                        underlayColor="#DDDDDD"
                        onPress={() => {
                            setModalVisible(!modalVisible);
                        ;playSoundTouch();}}
                    >
                        <Ionicons name="md-close" size={50} color={'#E14242'}/>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        {
            loading2 ? 
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#EC8944" />
            </View>
            :
            <ScrollView style={styles.practice} 
            showsVerticalScrollIndicator={false}
            >
                {
                    quizs.map((quiz, index) => {
                        const questions = quiz.questions.sort(() => Math.random() - 0.5);
                        return (
                            <BoxEx navigation={navigation} 
                                id={quiz.id}
                                key={index}
                                status={quiz.status}
                                level={quiz.level} 
                                highScore={quiz.highScore}
                                questions={questions}
                                time={quiz.time}
                                isDisable={quiz.isDisable}
                                setModalVisible={setModalVisible}
                                playSoundTouch={playSoundTouch}
                                playSoundLock={playSoundLock}
                                quizsLength={quizs.length}
                            />
                        )
                    })
                }
            </ScrollView>
        }
        

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      paddingTop: 25,
      paddingLeft: 30,
      paddingRight: 30,
      height: '100%',
      backgroundColor: '#FAEAD9', 
    },
    star: {
        width: 50,
        height: 50,
    },
    logo: {
        width: 65,
        height: 65,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#642900',
        marginLeft: 10,
    },

    text35Tile: {
        color: '#642900',
        fontWeight: 'bold',
        marginTop: 5,
    },
    

    // Statistical
    statistical: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        height: 100,
        backgroundColor: '#EC8944',
        borderRadius: 20,
        paddingRight: 20,
        paddingLeft: 10,
    },
    statisticalItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statisticalItemContent: {
        marginLeft: 5,
        flexDirection: 'column',
        alignItems: 'center',
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
    },
    text35Dark: {
        color: '#642900',
        fontWeight: 'bold',
        fontSize: 18,
    },

    // Review
    review: {
        marginTop: 20,
        marginBottom: 20,
    },
    boxExercise: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        height: 100,
        borderRadius: 20,
        paddingRight: 20,
        paddingLeft: 10,
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
    // Practice
    practice: {
        marginTop: 10,
    },
    level: {
        paddingBottom: 15,
    },
    // Loading
    loading: {
        marginTop: 40,
    },
    // Modal
    centeredView: {
        width: '100%',
        height: '100%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: { 
        width: '80%',
        height: '30%',
        padding: 20,
        paddingTop: 40,
        borderRadius: 20,
        flexDirection: 'column',
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FAEAD9",
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#642900',
        textAlign: "center",
    }

  });

export default HomeScreen;