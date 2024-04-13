import React, { useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from 'react-native';

export default AddCentreForm = ({ onSubmit }) => {
    const [centreData, setCentreData] = useState({
      name: '',
      address: '',
      ville: '',
      maxCapacity: '',
      openingHours: '',
    });
  
    const handleChange = (field, value) => {
      setCentreData({ ...centreData, [field]: value });
    };
  
    const handleSubmit = () => {
      onSubmit(centreData);
      setCentreData({
        name: '',
        address: '',
        ville: '',
        maxCapacity: '',
        openingHours: '',
      });
    };
  
    return (
      <View style={styles.addCentreForm}>
        <Text style={styles.formTitle}>Ajouter un nouveau centre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={centreData.name}
          onChangeText={(text) => handleChange('name', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Adresse"
          value={centreData.address}
          onChangeText={(text) => handleChange('address', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Ville"
          value={centreData.ville}
          onChangeText={(text) => handleChange('ville', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Capacité maximale"
          keyboardType="numeric"
          value={centreData.maxCapacity}
          onChangeText={(text) => handleChange('maxCapacity', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Heures d'ouverture"
          value={centreData.openingHours}
          onChangeText={(text) => handleChange('openingHours', text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.addButtonLabel}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    );
  };

const styles = StyleSheet.create({
    // Ajout de styles pour le formulaire
  addCentreForm: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    backgroundColor: '#ffffff',
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#173153',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addCentreText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
})