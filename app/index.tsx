import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from "../conexaoFirebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LinearGradient } from "expo-linear-gradient";

const schema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Ir para cadastro
  function IrParaCadastro() {
    router.replace("/cadastro");
  }

  function IrParaEsqueceuSenha() {
    router.replace("/esqueceuSenha");
  }

  // Função de verificação e login
  async function Verificacao(data: FormData) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.senha);
      const user = userCredential.user;

      const docRef = doc(db, "Usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dadosUsuario = docSnap.data();

        if (dadosUsuario.adm === true) {
          Alert.alert("Atenção", "Você está tentando entrar como Administrador. Por favor, entre pelo nosso site.");
        } else {
          router.push("/inicio");
        }
      } else {
        Alert.alert("Erro", "Usuário não encontrado no banco.");
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        Alert.alert("Erro", "Email ou senha inválidos.");
      } else {
        Alert.alert("Erro", "Erro ao fazer login. Verifique suas credenciais ou tente novamente mais tarde.");
      }
    }
  }


  return (
    <LinearGradient
      colors={["#0077b6", "#00b38f"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.tudo}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.quaseTudo}>
            <View style={styles.box}>
              <Text style={styles.titulo}>Login</Text>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Email:"
                    placeholderTextColor="#6b7280"
                    style={styles.campo}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.mensagemErro}>{errors.email.message}</Text>
              )}

              <Controller
                control={control}
                name="senha"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Senha:"
                    placeholderTextColor="#6b7280"
                    style={styles.campo}
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.senha && (
                <Text style={styles.mensagemErro}>{errors.senha.message}</Text>
              )}

              <TouchableOpacity onPress={IrParaEsqueceuSenha}>
                <Text style={styles.esqueceuSenhaTxt}>Esqueceu sua senha?</Text>
              </TouchableOpacity>

              <View style={styles.campobotoes}>
                <TouchableOpacity
                  style={styles.botao}
                  onPress={handleSubmit(Verificacao)}
                >
                  <Text style={styles.botaoTxt}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoSecundario}
                  onPress={IrParaCadastro}
                >
                  <Text style={styles.botaoTxt}>Cadastrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tudo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  quaseTudo: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  box: {
    backgroundColor: "rgba(255,255,255,0.9)",
    width: "100%",
    maxWidth: 420,
    minHeight: 480,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 10,
  },
  titulo: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    backgroundColor: "transparent",
    color: "#1e3a8a",
  },
  campo: {
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
  mensagemErro: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 5,
  },
  esqueceuSenhaTxt: {
    color: "#1e293b",
    fontWeight: "500",
    textAlign: "right",
    alignSelf: "flex-end",
    marginTop: 5,
    marginBottom: 15,
  },
  campobotoes: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 20,
  },
  botao: {
    backgroundColor: "#1e3a8a",
    borderRadius: 25,
    width: 120,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1e40af",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  botaoSecundario: {
    backgroundColor: "#0d9488",
    borderRadius: 25,
    width: 120,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0f766e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  botaoTxt: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
