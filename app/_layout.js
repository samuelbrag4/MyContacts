import React from "react";
import { Stack } from "expo-router";
import { Pressable, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Customizando o tema do Paper para usar a cor vermelha como primária
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#e30613", // Cor vermelha da paleta (Pantone 485)
    secondary: "#03DAC5",
  },
};

export default function Layout() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#e30613" }, // Cor vermelha da paleta (Pantone 485)
            headerTintColor: "#fff", // Cor do texto no cabeçalho (branco)
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "Contatos",
              headerRight: () => (
                <Pressable
                  onPress={() => router.push("/settings")} // Navegação para a tela de configurações
                  style={styles.gearButton}
                >
                  <Text style={styles.gearText}>⚙️</Text>
                </Pressable>
              ),
            }}
          />
          <Stack.Screen
            name="settings"
            options={{ title: "⚙️ Configurações" }} // Título para a tela de configurações
          />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

// Estilos aplicados
const styles = StyleSheet.create({
  gearButton: {
    marginRight: 16, // Espaçamento para o ícone de configurações
  },
  gearText: {
    color: "#fff", // Cor do ícone de configurações (branco)
    fontSize: 18, // Tamanho do texto
  },
});