import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconSub from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BoxOpts = (props) => {

    const propsOpts = props.options;
    const propsTime = props.time;
    const [time, setTime] = useState(propsTime);    
    const [selected, setSelected] = useState(false);

    const statusOptNormal = <Icon name="chevron-right" size={35} color="#FAEAD9" /> ;

    const [options, setOptions] = useState(
        propsOpts.map((item, index) => {
            return (
                <TouchableOpacity style={[styles.boxOptItem,{backgroundColor: '#EC8944'}]} key={index}
                    activeOpacity={0.6}
                    underlayColor="#DDDDDD"
                    onPress={() => handleAnswer(index)}
                >
                    <Text style={styles.boxOptItemText}>{item}</Text>
                    {statusOptNormal}
                    
                </TouchableOpacity>
            )
        })
    );
    const waitAMinute = () => {
        // setIsNext(true);
        if(!props.isEnd) {
            setTimeout(() => {
                props.setIsNext(true);
                setSelected(false);
            }, 0);
        }
    }
    useEffect(() => {
        const interval = setInterval(() => {
          setTime(time - 1);
        }, 1000);
        if(selected) {
          clearInterval(interval);
        } else if(time == 0) {
          clearInterval(interval);
          //////////////////
          handleAnswer(-1);////
          //////////////////
          waitAMinute();
        } else if(props.isEnd) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
      }, [time]);
    useEffect(() => {
        if(selected) {
            waitAMinute();
        } else {
            if(!props.isEnd) setTime(propsTime);
        }
    }, [selected]);


    useEffect(() => {
        setOptions(
            propsOpts.map((item, index) => {
                return (
                    <TouchableOpacity style={[styles.boxOptItem,{backgroundColor: '#EC8944'}]} key={index}
                        activeOpacity={0.6}
                        underlayColor="#DDDDDD"
                        onPress={() => handleAnswer(index)}
                    >
                        <Text style={styles.boxOptItemText}>{item}</Text>
                        {statusOptNormal}
                    </TouchableOpacity>
                )
            })
        );
    }, [propsOpts]);


    const indexAnswer = props.options.indexOf(props.answer);
    // S: Selected, NS: Not Selected
    const statusOptRightS = 
        <View style={styles.boxOptStatus}>
            <Text style={styles.text35Light}>CHÍNH XÁC</Text>
            <Icon name="check" size={32} color="#FAEAD9" />
        </View>;
    const statusOptRightNS = 
    <View style={styles.boxOptStatus}>
        <Text style={styles.text35Light}>ĐÁP ÁN ĐÚNG</Text>
        <Icon name="check" size={32} color="#FAEAD9" />
    </View>;
    const statusOptWrong =
        <View style={styles.boxOptStatus}>
            <Text style={styles.text35Light}>SAI RỒI NHA</Text>
            <Ionicons name="md-close" size={45} color={'#FAEAD9'}/>
        </View>;

    const handleAnswer = (indexx) => {
        setSelected(true);
        if(indexx == indexAnswer) {
            props.totalScore.current += 1;
            setOptions(
                props.options.map((item, index) => {
                    return (
                        index == indexx ?
                        <TouchableOpacity style={[styles.boxOptItem,{backgroundColor: '#2E9A6D'}]} key={index}
                            activeOpacity={0.6}
                            underlayColor="#DDDDDD"
                            
                        >
                            <Text style={styles.boxOptItemText}>{item}</Text>
                            {statusOptRightS}
                            
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={[styles.boxOptItem,{backgroundColor: '#EC8944'}]} key={index}
                            activeOpacity={0.6}
                            underlayColor="#DDDDDD"
                            
                        >
                            <Text style={styles.boxOptItemText}>{item}</Text>
                            {statusOptNormal}
                            
                        </TouchableOpacity>
                    )
                })
            );
        } else {
            setOptions(
                props.options.map((item, index) => {
                    return (
                        index == indexx ? 
                        <TouchableOpacity style={[styles.boxOptItem,{backgroundColor: '#E14242'}]} key={index}
                            activeOpacity={0.6}
                            underlayColor="#DDDDDD"
                            
                        >
                            <Text style={styles.boxOptItemText}>{item}</Text>
                            {statusOptWrong}
                        </TouchableOpacity>
                        : index == indexAnswer ?
                        <TouchableOpacity style={[styles.boxOptItem,{backgroundColor: '#2E9A6D'}]} key={index}
                            activeOpacity={0.6}
                            underlayColor="#DDDDDD"
                            
                        >
                            <Text style={styles.boxOptItemText}>{item}</Text>
                            {statusOptRightNS}
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={[styles.boxOptItem,{backgroundColor: '#EC8944'}]} key={index}
                            activeOpacity={0.6}
                            underlayColor="#DDDDDD"
                            
                        >
                            <Text style={styles.boxOptItemText}>{item}</Text>
                            {statusOptNormal}
                        </TouchableOpacity>
                    )
                })
            );

        }
    }

    return (
        <View style={styles.boxOpts}>
            <View style={styles.time}>
                <IconSub name="clock-o" size={40} color="#E14242" />
                <Text style={styles.textTime}>{time} giây</Text>
            </View>
            <View style={styles.boxQuestion}>
                <Text style={styles.question}>{props.question}</Text>
            </View>
            {options}
        </View>
    )
}

const styles = StyleSheet.create({
    boxOptItem: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 90,
        backgroundColor: '#EC8944',
        borderRadius: 20,
        marginBottom: 15,
        paddingLeft: 40,
        paddingRight: 20,
    },
    boxOptItemText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FAEAD9',
    },
    boxOptStatus: {
        flexDirection: 'row',
        alignItems: 'center',
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
  text35Light: {
    color: '#FAEAD9',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
},
});

export default BoxOpts;