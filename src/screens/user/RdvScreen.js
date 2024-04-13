import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { setUser } from '../../reducers/userSlice';
import { API_URL } from '../../api/global';
import { useIsFocused } from "@react-navigation/native";

export default function RdvScreen() {
  const [rdv, setRdv] = useState([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useIsFocused(() => {
    if(isFocused){ 
      loadRdvs();
    }
  },  [isFocused]);

  const loadRdvs = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      const useremail = await AsyncStorage.getItem("username");
      const responseprofile = await axios.post(`${API_URL}/api/v1/profile`,{
          username:useremail
      }, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });
      dispatch(setUser(responseprofile.data));
      console.log(responseprofile.data);
      const response = await axios.get(`${API_URL}/api/v1/rdv/user/${responseprofile.data.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      if (response && response.data) {
        setRdv(response.data);
      } else {
        throw new Error(response);
      }

    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error loading RDv');
    }
  };

  const removeItem = async (index) => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      console.log(rdv[index].id);
      
      Alert.alert(
        "Confirm",
        "Are you sure you want to delete this RDV?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            onPress: async () => {
              const response = await axios.delete(`${API_URL}/api/v1/rdv/${rdv[index].id}`, {
                headers: {
                  'Authorization': `Bearer ${jwtToken}`,
                  'Content-Type': 'application/json',
                },
              });
              if (response.status === 200) {
                // Remove the deleted item from the local state
                const updatedRdv = [...rdv];
                updatedRdv.splice(index, 1);
                setRdv(updatedRdv);
              } else {
                throw new Error(response);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error deleting RDV:', error);
    }
  };

  useEffect(() => {
    if(isFocused){ 
      loadRdvs()
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <ScrollView style={styles.container}>
        {rdv.length === 0 ? (
          <View style={styles.card}>
            <FontAwesome name="calendar-times-o" size={80} color="#FF6347" style={{ marginBottom: 16 }} />
            <Text style={styles.noRdvText}>No Appointments found</Text>
          </View>
        ) : (
          rdv.map(({ id, date, centre, creneau }, index) => {
            const parsedDate = new Date(date);
  
            // Format the date as "yyyy-dd-mm"
            const formattedDate = `${parsedDate.getFullYear()}-${parsedDate.getDate()}-${parsedDate.getMonth() + 1}`;
            return (
              <View key={index} style={styles.cardTop}> 
                <View style={[styles.radio]}>
                  <View style={styles.radioTop}>
                    <Text style={styles.radioLabel}>{formattedDate}</Text>
                    <Text style={styles.radioUsers}>
                      <Text style={{ fontWeight: '700' }}>{creneau.heureDebut}-{creneau.heureFin}</Text>
                    </Text>
                  </View>
                  <Text style={styles.radioDescription}>
                    <FontAwesome name="hospital-o" size={16} color="#848a96" /> 
                    <Text> {centre.name} | </Text>
                    <FontAwesome name="map-marker" size={16} color="#848a96" /> 
                    <Text> {centre.address}</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeItem(index)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 60,
    marginTop:30,
  },
  cardTop:{
    marginBottom:12
  },
  card: {
    padding: 24,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 12,
    marginTop:30
  },
  noRdvText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6347',
    textAlign: 'center',
  },
  /** Radio */
  radio: {
    position: 'relative',
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 12,
    borderRadius: 6,
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  radioActive: {
    borderColor: '#0069fe',
  },
  radioTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  radioUsers: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2f2f2f',
  },
  radioDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: '#848a96',
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
});
