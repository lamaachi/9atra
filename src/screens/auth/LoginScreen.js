import React, { useState,useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../../reducers/userSlice';
import { API_URL } from '../../api/global';
import { useIsFocused } from "@react-navigation/native";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused()
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  
  useEffect(() => {
    // Clear form fields when component mounts
    if(isFocused){
      setForm({ username: ''});
    }
  }, []);

  const handleLogin = async () => {
    try {
      if (!form.username || !form.password) {
        Alert.alert('Error', 'Please fill in all fields.');
        return;
      }
      
      const responselogin = await axios.post(`${API_URL}/api/v1/login`, form);

      if (responselogin.status === 200) {
        await AsyncStorage.setItem("jwtToken",responselogin.data.token)
        await AsyncStorage.setItem("username",form.username)

        //get current user
        const responseprofile = await axios.post(`${API_URL}/api/v1/profile`,{
            username:form.username
        }, {
          headers: {
            'Authorization': `Bearer ${responselogin.data.token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(responseprofile.data)
        dispatch(setUser(responseprofile.data))
        navigation.navigate('main');

      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>User Name</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(username) => setForm({ ...form, username })}
              placeholder="example"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.username}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              autoCorrect={false}
              onChangeText={(password) => setForm({ ...form, password })}
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.password}
            />
          </View>
          
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleLogin}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign in</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('register');
            }}>
            <Text style={styles.formFooter}>
              Don't have an account?{' '}
              <Text style={{ textDecorationLine: 'underline' }}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  header: {
    marginVertical: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1d1d1d',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
  },
  /** Form */
  form: {
    marginBottom: 24,
  },
  formAction: {
    marginVertical: 24,
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    textAlign: 'center',
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: '#FC2947',
    borderColor: '#FC2947',
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#fff',
  },
});
