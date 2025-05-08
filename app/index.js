import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { FAB, Dialog, Portal, Button, TextInput, RadioButton, Text, Divider, Searchbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactItem from '../components/ContactItem';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IndexScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('pessoal');
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Função para carregar contatos de exemplo caso esteja rodando na Web
  // e não tenha o AsyncStorage configurado corretamente
  const loadDemoContacts = () => {
    const demoContacts = [
      { id: '1', name: 'João Silva', phone: '(11) 98765-4321', category: 'pessoal' },
      { id: '2', name: 'Maria Oliveira', phone: '(21) 99876-5432', category: 'família' },
      { id: '3', name: 'Carlos Empresarial', phone: '(31) 97654-3210', category: 'trabalho' }
    ];
    setContacts(demoContacts);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      // Se estiver na web e não for possível usar AsyncStorage, carregue contatos de demonstração
      if (Platform.OS === 'web') {
        try {
          const storedContacts = await AsyncStorage.getItem('contacts');
          if (storedContacts) {
            setContacts(JSON.parse(storedContacts));
          } else {
            // Se não houver contatos no AsyncStorage, carrega os de demonstração
            loadDemoContacts();
          }
        } catch (error) {
          console.log('Error with AsyncStorage, using demo data instead:', error);
          loadDemoContacts();
        }
      } else {
        // Em dispositivos móveis, tente carregar normalmente do AsyncStorage
        const storedContacts = await AsyncStorage.getItem('contacts');
        if (storedContacts) {
          setContacts(JSON.parse(storedContacts));
        }
      }
    } catch (error) {
      console.log('Error loading contacts:', error);
    }
  };

  const saveContacts = async (updatedContacts) => {
    try {
      await AsyncStorage.setItem('contacts', JSON.stringify(updatedContacts));
    } catch (error) {
      console.log('Error saving contacts:', error);
      // Em caso de erro ao salvar, apenas atualize o estado local
      // para que o aplicativo continue funcionando na web
    }
  };

  const addContact = () => {
    if (!name.trim() || !phone.trim()) {
      // Use método de alerta compatível com web e mobile
      if (Platform.OS === 'web') {
        window.alert('Nome e telefone são obrigatórios');
      } else {
        Alert.alert('Erro', 'Nome e telefone são obrigatórios');
      }
      return;
    }

    const newContact = {
      id: editingId || Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
      category,
    };

    let updatedContacts;
    if (editingId) {
      updatedContacts = contacts.map(contact => 
        contact.id === editingId ? newContact : contact
      );
    } else {
      updatedContacts = [...contacts, newContact];
    }

    setContacts(updatedContacts);
    saveContacts(updatedContacts);
    resetForm();
  };

  const deleteContact = (id) => {
    const confirmDelete = () => {
      const updatedContacts = contacts.filter(contact => contact.id !== id);
      setContacts(updatedContacts);
      saveContacts(updatedContacts);
    };

    if (Platform.OS === 'web') {
      // Para web, use o confirm nativo do browser
      if (window.confirm('Tem certeza que deseja excluir este contato?')) {
        confirmDelete();
      }
    } else {
      // Para mobile, use o Alert do React Native
      Alert.alert(
        'Confirmar exclusão',
        'Tem certeza que deseja excluir este contato?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Excluir', 
            style: 'destructive',
            onPress: confirmDelete
          },
        ]
      );
    }
  };

  const editContact = (contact) => {
    setName(contact.name);
    setPhone(contact.phone);
    setCategory(contact.category);
    setEditingId(contact.id);
    setDialogVisible(true);
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setCategory('pessoal');
    setEditingId(null);
    setDialogVisible(false);
  };

  const filteredContacts = contacts.filter(contact => {
    return contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           contact.phone.includes(searchQuery);
  });

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="Buscar contatos"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <FlatList
        data={filteredContacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ContactItem contact={item} onEdit={editContact} onDelete={deleteContact} />
        )}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>Nenhum contato encontrado</Text>
          </View>
        )}
      />
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setDialogVisible(true)}
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={resetForm}>
          <Dialog.Title>{editingId ? 'Editar Contato' : 'Novo Contato'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nome"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              label="Telefone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
            />
            
            <Text style={styles.categoryLabel}>Categoria:</Text>
            <RadioButton.Group onValueChange={value => setCategory(value)} value={category}>
              <View style={styles.radioRow}>
                <RadioButton value="pessoal" />
                <Text>Pessoal</Text>
              </View>
              <View style={styles.radioRow}>
                <RadioButton value="trabalho" />
                <Text>Trabalho</Text>
              </View>
              <View style={styles.radioRow}>
                <RadioButton value="família" />
                <Text>Família</Text>
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={resetForm}>Cancelar</Button>
            <Button onPress={addContact}>Salvar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 8,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#e30613',
  },
  input: {
    marginBottom: 12,
  },
  categoryLabel: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
});