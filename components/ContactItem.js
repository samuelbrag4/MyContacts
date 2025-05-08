import React from 'react';
import { List, Avatar, IconButton, Menu } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

const ContactItem = ({ contact, onEdit, onDelete }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  
  const getAvatarColor = (category) => {
    switch (category) {
      case 'trabalho':
        return '#2196F3';  // Azul
      case 'pessoal':
        return '#4CAF50';  // Verde
      case 'família':
        return '#FF9800';  // Laranja
      default:
        return '#9C27B0';  // Roxo
    }
  };
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'trabalho':
        return 'briefcase';
      case 'pessoal':
        return 'account';
      case 'família':
        return 'home';
      default:
        return 'account';
    }
  };
  
  return (
    <List.Item
      title={contact.name}
      description={contact.phone}
      left={() => (
        <Avatar.Text 
          size={40} 
          label={contact.name.charAt(0).toUpperCase()} 
          backgroundColor={getAvatarColor(contact.category)}
        />
      )}
      right={() => (
        <View style={styles.actionsContainer}>
          <IconButton 
            icon={getCategoryIcon(contact.category)} 
            size={20} 
            iconColor={getAvatarColor(contact.category)}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={20}
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item title="Editar" leadingIcon="pencil" onPress={() => {
              setMenuVisible(false);
              onEdit(contact);
            }} />
            <Menu.Item title="Excluir" leadingIcon="delete" onPress={() => {
              setMenuVisible(false);
              onDelete(contact.id);
            }} />
          </Menu>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ContactItem;