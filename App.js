import 'react-native-gesture-handler';
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar, SafeAreaView, Alert } from "react-native";
import { TextInput } from "react-native-paper";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [data, setData] = useState([]);

  async function createData() {
    try {
      const response = await fetch("http://172.16.2.114:5000/api/todo", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          content: content,
          time: new Date().toLocaleTimeString(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Data created successfully:", responseData);

      // 데이터 생성이 성공하면 알림을 띄웁니다.
      Alert.alert("알림", "데이터가 성공적으로 생성되었습니다.");

    } catch (error) {
      console.error("Error creating data:", error);
      // 데이터 생성이 실패하면 에러 메시지를 알림으로 띄웁니다.
      Alert.alert("알림", "데이터 생성에 실패했습니다. 다시 시도해주세요.");
    }
  }

  async function readData() {
    try {
      const response = await fetch("http://172.16.2.114:5000/api/todo");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Data retrieved successfully:", responseData);
      setData(responseData);
      navigation.navigate('DataList', { data: responseData });
    } catch (error) {
      console.error("Error reading data:", error);
      Alert.alert("알림", "데이터 조회에 실패했습니다. 다시 시도해주세요.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <StatusBar style="auto" />
        <TextInput
          style={{ ...styles.input, marginTop: 200 }}
          placeholder={"제목을 입력하세요"}
          onChangeText={(data) => setTitle(data)}
        />
        <TextInput
          style={styles.input}
          placeholder={"내용을 입력하세요"}
          onChangeText={(data) => setContent(data)}
        />

        <TouchableOpacity style={styles.btn} onPress={createData}>
          <Text style={styles.btnText}>데이터 생성</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={readData}>
          <Text style={styles.btnText}>데이터 조회</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function DataListScreen({ route }) {
  const { data } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {data.map((item, index) => (
          <View
            key={index}
            style={{
              ...styles.itemContainer,
              marginHorizontal: 20,
              marginTop: index === 0 ? 10 : 20,
            }}
          >
            <Text style={styles.itemText}>제목: {item.title}</Text>
            <Text style={styles.itemText}>내용: {item.content}</Text>
            <Text style={styles.itemText}>시간: {item.time}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DataList" component={DataListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    alignItems: "center",
  },
  input: {
    width: 250,
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#000000', 
    borderWidth: 0.4,
    marginBottom: 20,
    borderRadius: 5,
    borderBottomWidth: 0,
  },
  btn: {
    width: 250,
    height: 50,
    backgroundColor: "#A593E0",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
  },
  itemContainer: {
    width: "90%",
    borderColor: "#000000",
    borderWidth: 0.4,
    padding: 10,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
  },
});
