import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import axios from "axios";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Swiper from 'react-native-swiper';
import { useIsFocused } from "@react-navigation/native";
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import { useDispatch,useSelector } from 'react-redux';
import { setCurrentCentre } from '../../reducers/centreSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your images
import chu1 from '../../../assets/chu1.jpg';
import chu3 from '../../../assets/chu3.png';
import chu4 from '../../../assets/chu4.png';
import { API_URL } from '../../api/global';
import { setUser } from '../../reducers/userSlice';

const items = [
  { name: 'Overview' },
];

const IMAGES = [
  chu1,
  chu3,
  chu4,
];


export default function CentreScreen({ navigation, route }) {
  const currentUser = useSelector((state) => state.user.currentUser);
  const { centreId,centreName, address, ville, maxCapacity, openingHours, reviews } = route.params;
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const [creneau,setCreneau] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCreneau, setSelectedCreneau] = useState(creneau[0]);
  const isFocused = useIsFocused();
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false);
  //rendez-vous data
  const [rdvuser,setRdvuser]= useState()
  const [heartClicked, setHeartClicked] = useState(false); // State to track whether the heart icon is clicked or not
  const getCurrentUSer = async ()=>{
    try {

      const token = await AsyncStorage.getItem('jwtToken');
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
      console.log(responseprofile.data.id)
      dispatch(setUser(responseprofile.data))
      setRdvuser(responseprofile.data.id)
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getCurrentUSer()
    if(isFocused){ 
      loadPickerData()
    }
  }, [isFocused])

  useEffect(() => {
    dispatch(setCurrentCentre({ centreId,centreName, address, ville, maxCapacity, openingHours, reviews }));
  }, [dispatch, centreName, address, ville, maxCapacity, reviews, openingHours,centreId]);

  const loadPickerData = async ()=>{
      try {
        const token = await AsyncStorage.getItem('jwtToken');  
        const response = await axios.get(`${API_URL}/api/v1/centre/${centreId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data.creneaux)
        setCreneau(response.data.creneaux)
      } catch (error) {   
                
      }
  }


 const handeleSubmit = async () => {
    try {
      if (!selectedCreneau || selectedCreneau==-1) {
        Alert.alert('Please select a creneau before submitting');
        return;
      }

      const token = await AsyncStorage.getItem('jwtToken');
      console.log(rdvuser+" "+selectedCreneau+" "+centreId+" "+date)
      const response = await axios.post(
        `${API_URL}/api/v1/rdv`,
        {
          userId: rdvuser,
          creneauId: selectedCreneau,
          centreId: centreId,
          date: date
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setModalVisible(false);
        Alert.alert("Success", "Appointment scheduled successfully!");
      } else {
        Alert.alert("Error", "Failed to schedule appointment. Please try again later.");
      }

    } catch (error) {
      console.error('Error scheduling appointment:', error);
      Alert.alert("Error", "Failed to schedule appointment. Please try again later.");
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <View style={styles.actions}>
        <SafeAreaView>
          <View style={styles.actionWrapper}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{ marginRight: 'auto' }}>
              <View style={styles.action}>
                <FeatherIcon
                  color="#242329"
                  name="chevron-left"
                  size={20} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // Toggle heart icon click
                setHeartClicked(!heartClicked);
              }}>
              <View style={styles.action}>
                <FeatherIcon
                  // color="#242329"
                  color={heartClicked ? "#F26463" : "#242329"}
                  name="heart"
                  size={18} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.tabs}>
            {items.map(({ name }, index) => {
              const isActive = index === value;

              return (
                <TouchableOpacity
                  key={name}
                  onPress={() => {
                    setValue(index);
                  }}
                  style={styles.tabsItemWrapper}>
                  <View style={styles.tabsItem}>
                    <Text
                      style={[
                        styles.tabsItemText,
                        isActive && { color: '#F26463' },
                      ]}>
                      {name}
                    </Text>
                  </View>

                  {isActive && <View style={styles.tabsItemLine} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={styles.photos}>
          <Swiper
            renderPagination={(index, total) => (
              <View style={styles.photosPagination}>
                <Text style={styles.photosPaginationText}>
                  {index + 1} / {total}
                </Text>
              </View>
            )}>
            {IMAGES.map((src, index) => (
              <View key={src} style={{ flex: 1 }}>
                <Image
                  alt=""
                  source={src}
                  style={styles.photosImg} />
              </View>
            ))}
          </Swiper>
        </View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{centreName}</Text>

          <View style={styles.headerRow}>
            <View style={styles.headerLocation}>
              <FeatherIcon
                color="#7B7C7E"
                name="map-pin"
                size={14} />

              <Text style={styles.headerLocationText}>
                {address},{ville}
              </Text>
            </View>

          </View>

          <View style={styles.headerRow}>
            <View style={styles.headerStars}>
              <FontAwesome
                color="#f26463"
                name="star"
                solid={true}
                size={14} />

              <FontAwesome
                color="#f26463"
                name="star"
                solid={true}
                size={14} />

              <FontAwesome
                color="#f26463"
                name="star"
                solid={true}
                size={14} />

              <FontAwesome
                color="#f26463"
                name="star"
                solid={true}
                size={14} />

              <FontAwesome color="#f26463" name="star" size={14} />

              <Text style={styles.headerStarsText}>{reviews} reviews</Text>
            </View>
          </View>
        </View>
        <View style={styles.picker}>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.pickerDates}>
            <FeatherIcon
              color="#242329"
              name="calendar"
              size={16} />

            <Text style={styles.pickerDatesText}>{openingHours}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.pickerDates}>
            <FontAwesome
                color="black"
                name="bed"
                size={16} />

            <Text style={styles.pickerDatesText}>{maxCapacity}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.stats}>
          <View style={styles.statsItem}>
            <FontAwesome color="#7B7C7E" name="wifi" size={15} />

            <Text style={styles.statsItemText}>Wifi</Text>
          </View>

          <View style={styles.statsItem}>
            <FontAwesome color="#7B7C7E" name="tv" size={15} />

            <Text style={styles.statsItemText}>Tv</Text>
          </View>

          <View style={styles.statsItem}>
            <FontAwesome color="#7B7C7E" name="coffee" size={15} />

            <Text style={styles.statsItemText}>Meal Included</Text>
          </View>
        </View>
        <View style={styles.about}>
          <Text style={styles.aboutTitle}>About Our Center</Text>

          <Text style={styles.aboutDescription}>
            Our blood donation center is dedicated to saving lives by providing a vital and essential service to the community. We are committed to ensuring a safe and comfortable environment for donors as they generously give the gift of life through their blood donations. Our trained medical staff conducts thorough screenings and tests to ensure the safety and quality of the collected blood.
            As we make our way through the bustling streets of London, our
            knowledgeable guide will provide fascinating commentary, sharing the
            history and culture of each location we visit. From the towering
            London Eye to the regal Buckingham Palace, you'll see it all from
            the best seat in the house.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.overlay}>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
            style={{ flex: 1, paddingHorizontal: 8 }}>
            <View style={styles.btnSecondary}>
              <Text style={styles.btnSecondaryText}>schedule an appointment</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for scheduling an appointment */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Schedule an Appointment</Text>

            {/* Date Picker */}
            <View style={styles.datePickerWrapper}>
              <Text style={styles.modalLabel}>Select a Date:</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.pickerDates}
              >
                <FeatherIcon color="#242329" name="calendar" size={16} />
                <Text style={styles.pickerDatesText}>
                  {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              const currentDate = selectedDate || date;
              setDate(currentDate);
            }}
            // Disable Sundays
            disabledDaysOfWeek={[1]}
          />
        )}
            </View>

            {/* Time Slot Picker */}
            <View style={styles.pickerWrapper}>
              <Text style={styles.modalLabel}>Select a Time Slot:</Text>
              <Picker
                selectedValue={selectedCreneau}
                style={styles.pickerFilter}
                onValueChange={(itemValue) => setSelectedCreneau(itemValue)}
              >
                <Picker.Item
                    key={-1}
                    label="Creneau"
                    value={-1}
                  />
                {creneau.map((creneau, index) => (
                  <Picker.Item
                    key={index}
                    label={`${creneau.heureDebut} - ${creneau.heureFin}`}
                    value={creneau.id}
                  />
                ))}
              </Picker>
            </View>

            {/* Buttons */}
            <View style={styles.buttonWrapper}>
              {/* Submit Button */}
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handeleSubmit}
              >
                <Text style={styles.modalSubmitBtnText}>Submit</Text>
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.modalCloseBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  /** Modal styles */
  modalSubmitBtn: {
    backgroundColor: '#F26463',
    padding: 10,
    marginRight:10,
    paddingHorizontal:20
  },
  modalSubmitBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 36,
    borderWidth: 1,
    backgroundColor: '#242329',
    borderColor: '#242329',
    height: 52,
  },
  btnText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '700',
    color: '#fff',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#F26463',
    borderColor: '#F26463',
    height: 52,
  },
  btnSecondaryText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '700',
    color: '#fff',
  },
  actions: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  footer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  action: {
    width: 36,
    height: 36,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderStyle: 'solid',
    borderRadius: 12,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: -8,
    marginBottom: 12,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 0,
  },
  tabsItemWrapper: {
    marginRight: 28,
  },
  tabsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  tabsItemText: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 20,
    color: '#7b7c7e',
  },
  tabsItemLine: {
    width: 20,
    height: 3,
    backgroundColor: '#f26463',
    borderRadius: 24,
  },
  photos: {
    paddingTop: 6,
    paddingHorizontal: 20,
    marginTop: 12,
    position: 'relative',
    height: 240,
    overflow: 'hidden',
    borderRadius: 12,
  },
  photosPagination: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#242329',
    borderRadius: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  photosPaginationText: {
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    color: '#ffffff',
  },
  photosImg: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    width: '100%',
    height: 240,
    borderRadius: 12,
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 22,
    lineHeight: 32,
    color: '#242329',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  headerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLocationText: {
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 20,
    color: '#7b7c7e',
    marginLeft: 4,
  },
  headerPrice: {
    fontWeight: '700',
    fontSize: 22,
    lineHeight: 32,
    textAlign: 'right',
    color: '#f26463',
  },
  headerStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerStarsText: {
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 20,
    color: '#7b7c7e',
  },
  headerDistance: {
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 20,
    color: '#7b7c7e',
  },
  picker: {
    marginTop: 6,
    marginHorizontal: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    height: 48,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderStyle: 'solid',
    borderRadius: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  pickerDates: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerDatesText: {
    marginLeft: 8,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
    color: '#242329',
  },
  pickerFilterWrapper: {
    borderLeftWidth: 1,
    borderColor: '#e5e5e5',
    paddingLeft: 12,
  },
  pickerFilter: {
    width: 150,
    height: 40,
  },
  pickerFilterItemText: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    color: '#242329',
    marginLeft: 4,
  },
  stats: {
    marginVertical: 16,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsItemText: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
    color: '#242329',
    marginLeft: 7,
  },
  about: {
    marginHorizontal: 20,
  },
  aboutTitle: {
    fontWeight: '700',
    fontSize: 22,
    lineHeight: 32,
    color: '#242329',
    marginBottom: 4,
  },
  aboutDescription: {
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 20,
    color: '#7b7c7e',
  },
  /** Modal styles */
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 28,
    color: '#242329',
  },
  modalCloseBtn: {
    backgroundColor: '#F26463',
    borderRadius: 0,
    padding: 10,
    marginLeft:10,
    paddingHorizontal:20
  },
  modalCloseBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 36,
    borderWidth: 1,
    backgroundColor: '#242329',
    borderColor: '#242329',
    height: 52,
  },
  btnText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '700',
    color: '#fff',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#F26463',
    borderColor: '#F26463',
    height: 52,
  },
  btnSecondaryText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '700',
    color: '#fff',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  datePickerWrapper: {
    marginBottom: 20,
  },
  pickerWrapper: {
    marginBottom: 20,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
