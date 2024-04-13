import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios'
import { API_URL } from '../../api/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../reducers/userSlice';
import { useIsFocused } from "@react-navigation/native";


export default HomeScreen = ({ navigation }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCentres, setFilteredCentres] = useState([]);
  const [allCentres, setAllCenters] = useState([])
  const isFocused = useIsFocused();

  
  useEffect(() => {
    
    if(isFocused){ 
      loadCentres()
    }
  },  [isFocused])

  const removeCentre = async (id) => {
    try {
      Alert.alert(
        "Confirmation",
        "Are you sure you want to remove this centre?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: async () => {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            console.log(id); // Ensure the correct ID is logged
            const response = await axios.delete(`${API_URL}/api/v1/centre/${id}`, {
              headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
              },
            });
            if (response.status === 200) {
              // Remove the deleted item from the local state
              const updatedCentres = filteredCentres.filter(centre => centre.id !== id);
              setFilteredCentres(updatedCentres);
            } else {
              throw new Error(response);
            }
          }}
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error deleting centre:', error);
    }
  };
  
  const handleSearch = (text) => {
    setSearchQuery(text);
    const newFilteredCentres = allCentres.filter((centre) =>
      centre.address.toLowerCase().includes(text.toLowerCase()) || centre.ville.toLowerCase().includes(text.toLowerCase()) || centre.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCentres(newFilteredCentres);
  };

  const loadCentres = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');  // Utilisez await pour obtenir le jeton
      console.log(token)
      const response = await axios.get(`${API_URL}/api/v1/centre`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Obtenir l'utilisateur actuel
      const useremail = await AsyncStorage.getItem("username");
      const responseprofile = await axios.post(`${API_URL}/api/v1/profile`, {
        username: useremail
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      dispatch(setUser(responseprofile.data))

      if (response && response.data) {
        setAllCenters(response.data);
        setFilteredCentres(response.data);
      } else {
        throw new Error(response);
      }

    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des centres');
    }
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Profile')
            }}>
            <Image
              alt=""
              source={
                require('../../../assets/user.png')
              }
              style={styles.avatar} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}>
            <FeatherIcon color="#1a2525" name="bell" size={24} />
          </TouchableOpacity>
        </View>
        {/* <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Bonjour, {currentUser?.firstname} !</Text>
        </View> */}
        <View style={styles.search}>
          <TextInput
            placeholder="Rechercher"
            placeholderTextColor="#9695b0"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <View style={styles.searchFloating}>
            <TouchableOpacity>
              <View style={styles.searchButton}>
                <FeatherIcon name="search" size={15} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        

        {filteredCentres.map(
          ({ id, name, address, ville, maxCapacity, openingHours, reviews }, index) => {
            return (
              <TouchableOpacity
                key={id}
                onPress={() => {
                  // handle onPress
                }}>
                <View style={styles.card}>
                  <Image
                    alt=""
                    resizeMode="cover"
                    source={require('../../../assets/chu.jpg')}
                    style={styles.cardImg} />

                  <View style={styles.cardBody}>
                    <Text>
                      <Text style={styles.cardTitle}>{name}</Text>{' '}
                      {/* <Text style={styles.cardAirport}>{airport}</Text> */}
                    </Text>

                    <View style={styles.cardRow}>
                      <View style={styles.cardRowItem}>
                        <FontAwesome
                          color="#6f61c4"
                          name="map-pin"
                          size={10} />

                        <Text style={styles.cardRowItemText}>{address}</Text>
                      </View>
                    </View>

                    

                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Centre', { centreId: id, centreName: name, address: address, ville: ville, maxCapacity: maxCapacity, openingHours: openingHours, reviews: reviews });
                        }}>
                        <View style={styles.btn}>
                          <Text style={styles.btnText}>Choisir</Text>
                        </View>
                      </TouchableOpacity>
                        {currentUser.role=="ADMIN" &&(
                          <TouchableOpacity
                            style={styles.rmvBtn}
                            onPress={()=>removeCentre(id)}>
                            <View style={styles.btn}>
                            <Text style={styles.btnText}>Remove</Text>
                          </View>
                        </TouchableOpacity>
                        )}

                      
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          },
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  top: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop:20
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 9999,
  },
  greeting: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    marginBottom: 12,
  },
  greetingTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a2525',
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a2525',
    marginTop: 8,
  },
  search: {
    marginTop:10,
    position: 'relative',
    
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f3f3f6',
    paddingHorizontal: 16,
    color: '#1a2525',
    fontSize: 18,
    borderRadius: 9999,
  },
  searchFloating: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  searchButton: {
    alignSelf: 'center',
    width: 30,
    height: 30,
    borderRadius: 9999,
    backgroundColor: '#FC2947',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingVertical: 16,
  },
  /** Card */
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal:5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardImg: {
    width: 120,
    height: 154,
    borderRadius: 12,
  },
  cardBody: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#173153',
    marginRight: 8,
  },
  cardAirport: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5f697d',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -8,
    flexWrap: 'wrap',
  },
  cardRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  cardRowItemText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
    color: '#5f697d',
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5f697d',
  },
  cardPriceValue: {
    fontSize: 21,
    fontWeight: '700',
    color: '#173153',
  },
  cardPriceCurrency: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6f61c4',
  },

  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    marginHorizontal:5,
    backgroundColor:"#FC2947",
    borderColor: '#FC2947',
  },
  btnText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
