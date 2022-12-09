import * as React from 'react';
import { StyleSheet, Button, View, Text, 
    Image, TouchableOpacity, ScrollView, 
    SafeAreaView, StatusBar, ActivityIndicator,
    Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BoxEx from '../components/BoxEx';
// import data from '../data/quizLevel.json';

function HomeScreen({ navigation }) {

    const [quizs, setQuizs] = useState([]);
    const [quizsReview, setQuizsReview] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetch('https://dataquizapp.glitch.me/quizsReview')
            .then((response) => response.json())
            .then((json) => setQuizsReview(json))
            .catch((error) => console.error(error));

        fetch('https://dataquizapp.glitch.me/quizsLevels')
            .then((response) => response.json())
            .then((json) => setQuizs(json))
            .catch((error) => console.error(error))
            .finally(() => {
                setLoading(false);
            });
    }, []);

    
    // const avgScore = (highScore.reduce((a, b) => a + b, 0) / highScore.length).toFixed(0);
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

    const highScoreReview = quizsReview[0]==undefined?10:quizsReview[0].highScore;

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.titleHeader}>
                <View style={styles.title}>
                    <Image source={require('../assets/star.png')} style={styles.star}/>
                    <Text style={styles.titleText}>Xin chào</Text>
                </View>
                <Text style={styles.text35Tile}>Hãy bắt đầu làm bài nào !</Text>
            </View>
            <Image source={require('../assets/splash.png')} style={styles.logo}/>
        </View>  

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

        <View style={styles.review}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="hand-point-right" size={20} color="#900" />
                <Text style={[styles.text25Dark,{marginLeft: 5}]}>Ôn lại kiến thức</Text>
            </View>
            <TouchableOpacity style={[styles.boxExercise, {backgroundColor: '#B09364' }]}
            onPress={() => {navigation.navigate('Quiz', 
                { 
                    level: false,
                    questions: quizsReview[0].questions,
                    time: quizsReview[0].time,
                    highScore: quizsReview[0].highScore,
                    status: quizsReview[0].status,
                    id : quizsReview[0].id,
                }
            );}}
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
                            Điểm đạt gần nhất: {highScoreReview} điểm
                        </Text>
                    </View>
                </View>
                <View style={styles.boxExerciseItem}>
                    <Text></Text>
                </View>
            </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="pencil-alt" size={20} color="#900" />
            <Text style={[styles.text25Dark,{marginLeft: 5}]}>Làm bài</Text>
        </View>
        {
            loading ? 
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#EC8944" />
            </View>
            :
            <ScrollView style={styles.practice} 
            showsVerticalScrollIndicator={false}
            >
                {
                    quizs.map((quiz, index) => {
                        return (
                            <BoxEx navigation={navigation} 
                                id={quiz.id}
                                key={index}
                                status={quiz.status}
                                level={quiz.level} 
                                highScore={quiz.highScore}
                                questions={quiz.questions}
                                time={quiz.time}
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
      paddingTop: 50,
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


  });

export default HomeScreen;