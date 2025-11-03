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

// Validação do formulário
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

  if (!email || !code) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Erro: dados insuficientes. Volte e tente novamente.</Text>
        <TouchableOpacity style={styles.botao} onPress={() => router.replace("/")}>
          <Text style={styles.btnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        router.replace("/"); // volta pro login
      } else {
        Alert.alert("Erro", result.error || "Erro ao redefinir sua senha. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Erro ao redefinir sua senha. Tente novamente mais tarde!");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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
              <Text style={styles.btnText}>Redefinir Senha</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  erro: {
    color: "red",
    marginBottom: 12,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  botao: {
    flex: 1,
    backgroundColor: "#2c3e50",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
