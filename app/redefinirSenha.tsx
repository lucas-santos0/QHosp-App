import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const schema = z
  .object({
    senha: z.string().min(6, "Senha inválida, mínimo de 6 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

type FormData = z.infer<typeof schema>;

export default function RedefinirSenha() {
  const { email, code } = useLocalSearchParams() as { email?: string; code?: string };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      const response = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          newPassword: data.senha,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", result.message || "Senha redefinida com sucesso!");
        router.replace("/");
      } else {
        Alert.alert("Erro", result.error || "Erro ao redefinir sua senha. Tente novamente.");
      }
    } catch (err) {
      Alert.alert("Erro", "Erro ao redefinir sua senha. Tente novamente mais tarde!");
    }
  }

  function voltar() {
    router.replace("/");
  }

  if (!email || !code) {
    return (
      <View style={styles.containerErro}>
        <Text style={styles.erroTitulo}>
          Erro: dados insuficientes. Volte e tente novamente.
        </Text>
        <TouchableOpacity style={styles.botaoVoltarErro} onPress={voltar}>
          <Text style={styles.btnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
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
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity style={styles.btnVoltar} onPress={voltar}>
              <MaterialIcons name="arrow-back-ios" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.box}>
              <Text style={styles.titulo}>Redefina sua senha!</Text>

              <Controller
                control={control}
                name="senha"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Insira sua nova senha"
                      secureTextEntry
                      value={value}
                      onChangeText={onChange}
                    />
                    <Text style={styles.erro}>{errors.senha?.message}</Text>
                  </>
                )}
              />

              <Controller
                control={control}
                name="confirmarSenha"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirme sua nova senha"
                      secureTextEntry
                      value={value}
                      onChangeText={onChange}
                    />
                    <Text style={styles.erro}>{errors.confirmarSenha?.message}</Text>
                  </>
                )}
              />

              <View style={styles.botoes}>
                <TouchableOpacity
                  style={[styles.botao, { backgroundColor: "#7f8c8d" }]}
                  onPress={() => reset()}
                >
                  <Text style={styles.btnText}>Limpar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botao} onPress={handleSubmit(onSubmit)}>
                  <Text style={styles.btnText}>Redefinir</Text>
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
    borderRadius: 20,
    padding: 32,
    width: "100%",
    maxWidth: 420,
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
    fontSize: 28,
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
    marginBottom: 8,
  },
  erro: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
    textAlign: "center",
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 10,
  },
  botao: {
    backgroundColor: "#2563eb",
    borderRadius: 25,
    height: 48,
    width: 140,
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
  btnVoltar: {
    position: "absolute",
    top: 40,
    left: 25,
    backgroundColor: "#10b981",
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  containerErro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  erroTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e3a8a",
    textAlign: "center",
    marginBottom: 20,
  },
  botaoVoltarErro: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
});
