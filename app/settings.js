import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { List, Switch, Button, Divider, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [darkTheme, setDarkTheme] = useState(false);
  const [sortByName, setSortByName] = useState(true);
  const [contactCount, setContactCount] = useState(0);

  useEffect(() => {
    loadSettings();
    countContacts();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setDarkTheme(parsed.darkTheme || false);
        setSortByName(parsed.sortByName !== false);
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify({
        darkTheme,
        sortByName,
      }));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const countContacts = async () => {
    try {
      const contacts = await AsyncStorage.getItem('contacts');
      if (contacts) {
        setContactCount(JSON.parse(contacts).length);
      }
    } catch (error) {
      console.log('Error counting contacts:', error);
    }
  };

  useEffect(() => {
    saveSettings();
  }, [darkTheme, sortByName]);

  const clearAllContacts = () => {
    Alert.alert(
      'Apagar todos os contatos',
      'Tem certeza que deseja apagar todos os seus contatos? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Apagar tudo', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('contacts');
              setContactCount(0);
              Alert.alert('Sucesso', 'Todos os contatos foram removidos');
            } catch (error) {
              console.log('Error clearing contacts:', error);
            }
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <List.Section>
        <List.Subheader>Preferências</List.Subheader>
        
        <List.Item
          title="Tema escuro"
          description="Alterna entre tema claro e escuro"
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => <Switch value={darkTheme} onValueChange={setDarkTheme} />}
        />
        
        <Divider />
        
        <List.Item
          title="Ordenar por nome"
          description="Ordena a lista de contatos por nome"
          left={props => <List.Icon {...props} icon="sort-alphabetical-ascending" />}
          right={() => <Switch value={sortByName} onValueChange={setSortByName} />}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Informações</List.Subheader>
        
        <List.Item
          title="Total de contatos"
          description={`${contactCount} contatos salvos`}
          left={props => <List.Icon {...props} icon="contacts" />}
        />
        
        <Divider />
        
        <List.Item
          title="Versão do aplicativo"
          description="1.0.0"
          left={props => <List.Icon {...props} icon="information" />}
        />
      </List.Section>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          buttonColor="#ff5252"
          onPress={clearAllContacts}
        >
          Apagar todos os contatos
        </Button>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>MyContacts © 2025</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    padding: 16,
    marginTop: 16,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    color: '#888',
  }
});