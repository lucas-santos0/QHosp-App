import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Inicio() {
  return (
    <LinearGradient
      colors={["#0077b6", "#00b38f"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.box}>
              <Text style={styles.titulo}>Busque pelo Hospital desejado!</Text>

              <TextInput
                style={styles.input}
                placeholder="Digite o nome do município"
                placeholderTextColor="#6b7280"
              />
              <TextInput
                style={styles.input}
                placeholder="Digite o nome do estabelecimento"
                placeholderTextColor="#6b7280"
              />

              <TouchableOpacity style={styles.botao}>
                <Text style={styles.btnText}>Buscar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    color: "#1e3a8a",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 2,
    borderColor: "#d1d5db",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    height: 50,
    width: "100%",
    fontSize: 16,
    paddingHorizontal: 15,
    color: "#111827",
    marginBottom: 14,
  },
  botao: {
    backgroundColor: "#2563eb",
    borderRadius: 25,
    height: 48,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#1e40af",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
