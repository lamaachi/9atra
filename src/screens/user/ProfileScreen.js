import React, { useEffect,useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  TextInput,
  
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch,useSelector } from 'react-redux';
import { clearUser,setUser } from '../../reducers/userSlice';
import axios from 'axios';
import { API_URL } from '../../api/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MultiSelect from 'react-native-multiple-select';
const CARD_WIDTH = Math.min(Dimensions.get('screen').width * 0.75, 400);

const creneauxList = [
  {
      "heureDebut": "08:00",
      "heureFin": "10:00"
  },
  {
    "heureDebut": "10:00",
    "heureFin": "12:00"
  },
  {
      "heureDebut": "13:00",
      "heureFin": "16:00"
  },
  {
    "heureDebut": "16:00",
    "heureFin": "18:00"
  }
]

const MoroccanCities = [
  "Agadir",
  "Al Hoceïma",
  "Asilah",
  "Beni Mellal",
  "Boujdour",
  "Casablanca",
  "Chefchaouen",
  "Dakhla",
  "El Jadida",
  "Errachidia",
  "Essaouira",
  "Fès",
  "Guelmim",
  "Ifrane",
  "Kénitra",
  "Khouribga",
  "Laâyoune",
  "Larache",
  "Marrakech",
  "Meknès",
  "Mohammédia",
  "Nador",
  "Ouarzazate",
  "Oujda",
  "Rabat",
  "Safi",
  "Salé",
  "Tangier",
  "Tarfaya",
  "Taza",
  "Témara",
  "Tétouan",
  "Tiznit"
];

export default function ProfileScreen({navigation}) {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch()

  // State for form inputs and error message
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [city, setCity] = useState('');

  const centre = {
    name:name,
    address:address,
    ville:city,
    maxCapacity:maxCapacity,
    openingHours:"09:00-18:00"
  }

  const handleCityChange = (itemValue, itemIndex) => {
    setCity(itemValue);
  };

  const handleChange = (text) => { 
    // Allow only numbers 
    const numericValue = text.replace(/[^0-9]/g, ""); 
    setMaxCapacity(numericValue); 
  }; 

  useEffect(()=>{

  },[])


    const handleSubmitNewCentre = async () => {
      // Validate form fields
      if (!name.trim() || !address.trim() || !city || !maxCapacity || city==-1) {
        Alert.alert('Please fill in all fields');
        return;
      }

      try {
        const token = await AsyncStorage.getItem('jwtToken');
        //get current user
        const useremail = await AsyncStorage.getItem("username");
        const centredata = await axios.post(`${API_URL}/api/v1/centre`,{
            centre:centre,
            creneaux:creneauxList
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(centredata.data.id)
        if (centredata.status===200) {
          // Response status is 200, show confirmation alert
          Alert.alert(
            'Success',
            'Centre details submitted successfully!',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        } else {
          // Response status is not 200, handle error
          throw new Error('Failed to submit centre details');
        }

      } catch (error) {
        console.error('Error:', error.message);
      Alert.alert(
        'Error',
        'Failed to submit centre details. Please try again later.',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      );
      }
    };  

    const handleLogout = async () => {
      // const tokessn = await AsyncStorage.removeItem("jwtToken")
      // const tokffen = await AsyncStorage.removeItem("username")
      try {
        const token = await AsyncStorage.getItem("jwtToken")
        
        if (!token) {
          throw new Error('Token not found');
        }

        //get current user
        const useremail = await AsyncStorage.getItem("username");
        const responseprofile = await axios.post(`${API_URL}/api/v1/profile`,{
            username:useremail
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log(useremail)
        console.log(responseprofile.data)
        
        dispatch(setUser(responseprofile.data))

        const response =  await axios.get(`${API_URL}/api/v1/logout`,{},{
          headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })
        if (response.status === 200) {
          await AsyncStorage.removeItem('jwtToken');
          await AsyncStorage.removeItem('username');
        } else {
          throw new Error('Logout failed');
        }
        navigation.navigate('login');
      } catch (error) {
        console.error('Error logging out:', error);
        Alert.alert('Logout Error', 'Failed to logout. Please try again.');
      }
    };


    const handleDeleteAccount = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
  
        if (!token) {
          throw new Error('Token not found');
        }
  
        Alert.alert(
          'Delete Account',
          'Are you sure you want to delete your account?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: async () => {
                const response = await axios.delete(`${API_URL}/api/v1/user/delete/${currentUser.id}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  }
                });
                
                if (response.status === 200) {
                  await AsyncStorage.removeItem('jwtToken');
                  dispatch(clearUser());
                  navigation.navigate('login');
                } else {
                  throw new Error('Account deletion failed');
                }
              },
            },
          ],
          { cancelable: false }
        );
        
      } catch (error) {
        console.error('Error deleting account:', error);
        Alert.alert('Account Deletion Error', 'Failed to delete account. Please try again.');
      }
    };



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.profile}>
              <View style={styles.profileTop}>
                <View style={styles.avatar}>
                  <Image
                    alt=""
                    source={require('../../../assets/user.png')}
                    style={styles.avatarImg} />

                  <View style={styles.avatarNotification} />
                </View>

                <View style={styles.profileBody}>
                  <Text style={styles.profileTitle}>{currentUser && currentUser.firstname} {currentUser && currentUser.lastname}</Text>

                  <Text style={styles.profileSubtitle}>
                    {currentUser && currentUser.role}- {currentUser && currentUser.username}
                  </Text>
                </View>
              </View>

              <Text style={styles.profileDescription}>
               
              </Text>
            </View>

                    

            <View style={styles.contentActions}>
              <TouchableOpacity
                onPress={() => {
                  handleLogout()
                }}
                style={{ flex: 1, paddingHorizontal: 6 }}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>LogOut </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleDeleteAccount()
                }}
                style={{ flex: 1, paddingHorizontal: 6 }}>
                <View style={styles.btnPrimary}>
                  <Text style={styles.btnPrimaryText}>Delete Account</Text>
                </View>
              </TouchableOpacity>
            </View>

            
          </View>
          {currentUser && currentUser.role === 'ADMIN' && (
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
              />
              <Picker
              selectedValue={city}
              onValueChange={handleCityChange}>
              <Picker.Item key={-1} label="Chose a City" value={-1} />
              {MoroccanCities.map((city, index) => (
                <Picker.Item key={index} label={city} value={city} />
              ))}
              </Picker>
              <TextInput
                style={styles.input}
                placeholder="Max Capacity"
                keyboardType="number-pad"
                value={maxCapacity}
                onChangeText={(text)=> handleChange(text)}
              />
              
              <TouchableOpacity style={styles.addButton} onPress={handleSubmitNewCentre}>
                <Text style={styles.addButtonText}>Add Centre</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  headerAction: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerSearch: {
    position: 'relative',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerSearchIcon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  headerSearchInput: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    paddingLeft: 34,
    width: '100%',
    fontSize: 16,
    fontWeight: '500',
  },
  /** Content */
  content: {
    marginTop:50,
    paddingTop: 12,
    paddingHorizontal: 24,
  },
  contentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginHorizontal: -6,
    marginBottom: 0,
  },
  /** Profile */
  profile: {
    paddingTop: 4,
    paddingBottom: 16,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  profileBody: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingLeft: 16,
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 32,
    color: '#121a26',
    marginBottom: 6,
  },
  profileSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#778599',
  },
  profileDescription: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    color: '#778599',
  },
  profileTags: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileTagsItem: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    color: '#266ef1',
    marginRight: 4,
  },
  /** Avatar */
  avatar: {
    position: 'relative',
  },
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 9999,
  },
  avatarNotification: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: '#fff',
    bottom: 0,
    right: -2,
    width: 21,
    height: 21,
    backgroundColor: '#22C55E',
  },
  /** Stats */
  stats: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#90a0ca',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 1,
  },
  statsItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    borderLeftWidth: 1,
    borderColor: 'rgba(189, 189, 189, 0.32)',
  },
  statsItemText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
    color: '#778599',
    marginBottom: 5,
  },
  statsItemValue: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    color: '#121a26',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    backgroundColor: 'transparent',
    borderColor: '#FC2947',
  },
  btnText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: '#FC2947',
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    backgroundColor: '#FC2947',
    borderColor: '#FC2947',
  },
  btnPrimaryText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: '#fff',
  },
  /** List */
  list: {
    marginTop: 16,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
    color: '#121a26',
  },
  listAction: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#778599',
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  /** Card */
  card: {
    width: CARD_WIDTH,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginHorizontal: 6,
    shadowColor: '#90a0ca',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff1f5',
  },
  cardBody: {
    paddingLeft: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 18,
    color: '#121a26',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    color: '#778599',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  cardFooterText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: '#778599',
  },
  form: {
    marginTop:10,
    marginBottom: 20,
    marginHorizontal:30
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  contentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});