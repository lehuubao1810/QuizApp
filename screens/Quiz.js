import * as React from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconSub from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BoxOpts from '../components/BoxOpts';
import { useState, useEffect, useRef } from 'react';
import Modal from "react-native-modal";

import { Audio } from 'expo-av';

function QuizScreen({ navigation, route }) {
  // Sounds Effect
  const [sound, setSound] = useState();
  async function playSoundTouch() {
    const { sound } = await Audio.Sound.createAsync( require(`../assets/sounds/touch.mp3`));
    setSound(sound);
    await sound.playAsync();
  }
  async function playSoundSuccess() {
    const { sound } = await Audio.Sound.createAsync( require(`../assets/sounds/done.mp3`));
    setSound(sound);
    await sound.playAsync();
  }
  async function playSoundFailure() {
    const { sound } = await Audio.Sound.createAsync( require(`../assets/sounds/failure.mp3`)
    );
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
  // End Sounds Effect
  const updateData = (id, typeData, newData, obj) => {
    // update an anything of id by PATCH method
    fetch(`https://dataquizapp.glitch.me/${obj}/${id}`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            [typeData] : newData,
        }),
    })           
};

  const generateQuiz = route.params.level ? true : false;
  const title = generateQuiz ? `Cấp độ ${route.params.level}` : 'Câu hỏi tổng hợp';

  const [recentScore, setRecentScore] = useState('');

  // const [time, setTime] = useState(30);
  const [questions, setQuestions] = useState(route.params.questions);

  const indexQuestion = useRef(0);
  // const [isRight, setIsRight] = useState(null);
  const [isEnd, setIsEnd] = useState(false);
  const [isShowResult, setIsShowResult] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const totalScore = useRef(0);

  let question = 
    <BoxOpts 
      question={questions[indexQuestion.current].question}
      answer={questions[indexQuestion.current].answer}
      options={questions[indexQuestion.current].options}
      setIsNext={setIsNext}
      indexQuestion={indexQuestion}
      totalScore={totalScore}
      isEnd={isEnd}
      time={route.params.time}
      status={route.params.status}
    />
    
  useEffect(() => {
    if(isNext) {
      if(indexQuestion.current < 9) {
        indexQuestion.current++;
        setIsNext(false);
      } else {
        setIsEnd(true);
      }
    }
  }, [isNext]);

  useEffect(() => {
    if(isEnd) {
      setIsShowResult(true);
      if (!route.params.level) {
        setRecentScore(route.params.highScore);
        updateData(1,"recentScore", totalScore.current, "reviewData")
        // Play sound effect
        if (totalScore.current < 6) {
          playSoundFailure();
        } else {
          playSoundSuccess();
        }
        // End play sound effect
      } else {
        // Play sound effect
        if (totalScore.current < 6) {
          playSoundFailure();
        } else {
          playSoundSuccess();
        }
        // End play sound effect
        if (route.params.highScore < totalScore.current) {
          route.params.highScore = totalScore.current;
          updateData(route.params.id,"highScore", totalScore.current, "quizsLevels")
        } 
        if (route.params.highScore < 6) {
          updateData(route.params.id,"status", 1, "quizsLevels");
        } else {
          updateData(route.params.id,"status", 2, "quizsLevels");
          // Unlock next level
          if (route.params.id <= route.params.quizsLength) {
            updateData(route.params.id+1,"isDisable", false, "quizsLevels");
          }
        }
      } 
    }
  }, [isEnd]);

  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.back}
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={() => {navigation.navigate('HomeTab');}}
        >
          <Icon name="chevron-left" size={35} color="#642900" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.numOfQuestion}>{`${indexQuestion.current+1}/10`}</Text>
      </View>
      { question }
      {}
      <Modal 
        isVisible={isShowResult}
        animationIn="pulse"
        animationOut="pulse"
      >
        <View style={styles.modalResult}>
          <Text style={styles.textModal}>🎊HOÀN THÀNH🎊</Text>
          <Text style={styles.text35Dark}>✨Điểm của em là: {totalScore.current}</Text>
          {
            route.params.level ?
            <Text style={styles.text35Dark}>🎉Điểm cao nhất của em là: {route.params.highScore}</Text>
            :             
            <Text style={styles.text35Dark}>🎉Điểm đạt được lần trước: {recentScore}</Text>
          }

          <View style={{flexDirection:'row', width:'45%', justifyContent: 'space-between', marginTop: 20}}>
            <TouchableOpacity
              style={styles.backHome}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={() => {
                navigation.navigate('HomeTab')
                // refresh UI
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'HomeTab' }],
                });
              playSoundTouch()}}
            >
              <Ionicons name="home" size={40} color="#642900" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.repeat}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={() => {
                // repeat quiz
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Quiz', params: route.params }],
                });
              playSoundTouch()}}
            >
              <IconSub name="repeat" size={40} color="#642900" />
            </TouchableOpacity>
            
          </View>

        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'center',
    position: 'relative',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#642900',
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
  },
  numOfQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#642900',
  },
  back: {
    zIndex: 10,
  },
  // Time
  time: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  textTime: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#E14242',
    marginLeft: 10,
  },
  // Box Question
  boxQuestion: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    backgroundColor: '#F6D1AB',
    borderRadius: 20,
    marginBottom: 20,
  },
  question: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#642900',
  },
  // Modal Result
  modalResult: {
    backgroundColor: '#FAEAD9',
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  textModal: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#642900',
    marginBottom: 20,
  },
  text35Dark: {
    color: '#642900',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
},

});

export default QuizScreen;