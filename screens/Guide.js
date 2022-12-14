import * as React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function GuideScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HƯỚNG DẪN SỬ DỤNG</Text>
      <Text style={styles.text35Dark}>
        Mỗi cấp độ có 10 câu hỏi. Mỗi câu hỏi tương đương với 1 điểm
      </Text>
      <Text style={styles.text35Dark}>
        Mỗi câu hỏi sẽ có từ 10 đến 30 giây để trả lời ( tùy vào từng cấp độ )
        <Text style={{color: '#E14242'}}> Nếu hết thời gian mà vẫn chưa trả lời thì tính là trả lời sai</Text>
      </Text>
      <Text style={styles.text35Dark}>
        Khi đạt được <Text style={{color: '#E14242'}}>điểm số từ 6 trở lên</Text> thì sẽ được chuyển sang cấp độ tiếp theo
        <Text style={{color: '#E14242'}}> (các cấp độ sau sẽ bị khóa nếu chưa đạt yêu cầu)</Text>
      </Text>
      <Text style={styles.text35Dark}>
      Cấp độ càng cao thì câu hỏi sẽ càng khó và thời gian trả lời sẽ càng ngắn
      </Text>
      <Text style={styles.text35Dark}>
        Sau khi làm xong 1 cấp độ bất kì thì điểm sẽ được hiển thị ở ngoài ( có thể làm lại để ôn tập, cải thiện điểm số )
      </Text>
      <Text style={styles.text35Dark}>
        Câu hỏi tổng hợp gồm 10 câu hỏi được lấy ngẫu nhiên trong các câu hỏi thuộc các cấp độ đã hoàn thành với<Text style={{color: '#E14242'}}> thời gian mặc định là 10 giây</Text> 
      </Text>
      <Text style={styles.textCopyright}> Copyright by Le Huu Bao </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    paddingTop: 40,
    paddingLeft: 30,
    paddingRight: 30,
  },
  title: {
    fontSize: 20,
    marginBottom: 30,
    color: '#642900',
    fontWeight: 'bold',
  },
  text35Dark: {
    color: '#642900',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
},
textCopyright: {
  marginTop: 20,
  color: '#642900',
  fontWeight: 'bold',
  fontSize: 14,
  textAlign: 'center',
},
});
export default GuideScreen;