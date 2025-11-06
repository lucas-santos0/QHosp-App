import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Contato() {
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");

  const limparCampos = () => {
    setEmail("");
    setAssunto("");
    setMensagem("");
  };

  async function enviarMensagem() {
    if (!email || !assunto || !mensagem) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, assunto, mensagem }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", result.message || "Mensagem enviada com sucesso!");
        limparCampos();
      } else {
        Alert.alert("Erro", result.error || "Erro ao enviar mensagem. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    }
  }

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
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.box}>
              <Text style={styles.titulo}>Entre em Contato</Text>
              <Text style={styles.subtitulo}>
                Está tendo problemas? Envie um e-mail para nossa equipe!
              </Text>

              <TextInput
                placeholder="Insira seu Email:"
                style={styles.input}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />

              <TextInput
                placeholder="Insira o Assunto:"
                style={styles.input}
                value={assunto}
                onChangeText={setAssunto}
              />

              <TextInput
                placeholder="Insira uma Mensagem:"
                style={styles.inputMensagem}
                value={mensagem}
                onChangeText={setMensagem}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />

              <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btn} onPress={limparCampos}>
                  <Text style={styles.btnText}>Limpar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={enviarMensagem}>
                  <Text style={styles.btnText}>Enviar</Text>
                </TouchableOpacity>
              </View>
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
    borderRadius: 30,
    padding: 24,
    width: "100%",
    maxWidth: 420,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: "#1e3a8a",
  },
  subtitulo: {
    textAlign: "center",
    fontSize: 15,
    color: "#4b5563",
    marginBottom: 20,
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
    marginBottom: 10,
  },
  inputMensagem: {
    borderWidth: 2,
    borderColor: "#d1d5db",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    width: "100%",
    fontSize: 16,
    padding: 15,
    color: "#111827",
    marginBottom: 10,
    height: 120,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 10,
  },
  btn: {
    backgroundColor: "#2563eb",
    borderRadius: 25,
    height: 48,
    width: 130,
    justifyContent: "center",
    alignItems: "center",
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
