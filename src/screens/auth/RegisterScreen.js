import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from '../../reducers/userSlice';

import FeatherIcon from 'react-native-vector-icons/Feather';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../api/global';

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch()
  const [isFormValid, setIsFormValid] = useState(false);
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    telephone: '',
    confirmPassword: '',
    role:'USER'
  });

  const validateForm = () => {
    let isValid = true;

    // Validate name field 
    if (!form.firstname || !form.lastname) {
      Alert.alert("", "First and last names are required.");
      isValid = false;
    }

    // Validate username field 
    if (!form.username) {
      Alert.alert("", 'Email is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.username)) {
      Alert.alert("", 'Email is invalid.');
      isValid = false;
    }

    // Validate password field 
    if (!form.password) {
      Alert.alert("", 'Password is required.');
      isValid = false;
    } else if (form.password.length < 6) {
      Alert.alert("", 'Password must be at least 6 characters.');
      isValid = false;
    }
    // Validate telephone field
    if (!form.telephone) {
      Alert.alert("", 'Telephone is required.');
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(form.telephone)) {
      Alert.alert("", 'Telephone number is invalid.');
      isValid = false;
    }
    // Validate confirmPassword field
    if (form.password !== form.confirmPassword) {
      Alert.alert("", 'Passwords do not match.');
      isValid = false;
    }

    setIsFormValid(isValid);
    return isValid;
  };

  const handleRegister = async () => {
    const isValid = validateForm();

    if (isValid) {
      try {
        const response = await axios.post(`${API_URL}/api/v1/register`, form);
        
        if (response.status === 200) {
          // Save token to AsyncStorage
          if (response.data.token == null) {
            Alert.alert("", "User already exists");
          } else {
            await AsyncStorage.setItem('jwtToken', response.data.token);
            console.log(response.data)
            await AsyncStorage.setItem('username', form.username);

            //get current user
            const responseprofile = await axios.post(`${API_URL}/api/v1/profile`,{
                username:form.username
            }, {
              headers: {
                'Authorization': `Bearer ${response.data.token}`,
                'Content-Type': 'application/json',
              },
            });
          console.log(responseprofile.data)
          dispatch(setUser(responseprofile.data))
            navigation.navigate('main');
          }
        } else {
          throw new Error(response.data.message || 'Registration failed');
        }
      } catch (error) {
        Alert.alert('Registration Error', error.message);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View style={styles.headerBack}>
                <FeatherIcon color="#1D2A32" name="chevron-left" size={30} />
              </View>
            </TouchableOpacity>

            <Text style={styles.title}>Let's Get Started!</Text>

            <Text style={styles.subtitle}>
              Fill in the fields below to get started with your new account.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                clearButtonMode="while-editing"
                onChangeText={(firstname) => setForm({ ...form, firstname })}
                placeholder="John"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.firstname}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                clearButtonMode="while-editing"
                onChangeText={(lastname) => setForm({ ...form, lastname })}
                placeholder="Doe"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.lastname}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address" // Use email-address instead of username-address
                onChangeText={(username) => setForm({ ...form, username })}
                placeholder="john@example.com"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.username}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Telephone</Text>
              <TextInput
                keyboardType="phone-pad"
                onChangeText={(telephone) => setForm({ ...form, telephone })}
                placeholder="1234567890"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.telephone}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(password) => setForm({ ...form, password })}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.password}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(confirmPassword) => setForm({ ...form, confirmPassword })}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.confirmPassword}
              />
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleRegister}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Get Started</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("login")
          }}
          style={{ marginTop: 'auto' }}>
          <Text style={styles.formFooter}>
            Already have an account?{' '}
            <Text style={{ textDecorationLine: 'underline' }}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  /** Header */
  header: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  headerBack: {
    padding: 8,
    paddingTop: 0,
    position: 'relative',
    marginLeft: -16,
    marginBottom: 6,
  },
  /** Form */
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
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
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#FC2947',
    borderColor: '#FC2947',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});
