import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, Image,} from "react-native";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../conexaoFirebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; // Importe outros ícones se necessário


const schema = z
  .object({
    nome: z.string().min(3, "Nome obrigatório"),
    cpf: z.string().min(11, "CPF inválido"),
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Mínimo 6 caracteres"),
    confirmarSenha: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    path: ["confirmarSenha"],
    message: "As senhas não coincidem",
  });

type FormData = z.infer<typeof schema>;

export default function Cadastro() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function cadastrarUsuario(data: FormData) {
    try {
      const cpfLimpo = data.cpf.replace(/\D/g, ""); // remove pontuação

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.senha
      );
      const user = userCredential.user;

      await setDoc(doc(db, "Usuarios", user.uid), {
        Nome: data.nome,
        CPF: cpfLimpo,
        Email: data.email,
        adm: false,
      });

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      reset();
      router.replace("/");
    } catch (e: any) {
      console.error("Erro ao cadastrar:", e);
      if (e.code === "auth/email-already-in-use") {
        Alert.alert("Erro", "Este e-mail já está em uso.");
      } else {
        Alert.alert("Erro", "Erro ao cadastrar. Tente novamente.");
      }
    }
  }
  function voltar(){
        router.replace("/");
    
  }
  return (
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
                      <MaterialIcons size={30} name="arrow-back-ios" />
          </TouchableOpacity>

          <Text style={styles.titulo}>Criar uma conta</Text>
          <Text style={styles.descricao}>
            Insira seus dados para se cadastrar neste aplicativo
          </Text>

          {/* Nome */}
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Nome completo"
                style={styles.input}
                value={value}
                onChangeText={onChange}
                autoCapitalize="words"
              />
            )}
          />
          {errors.nome && (
            <Text style={styles.errorText}>{errors.nome.message}</Text>
          )}

          {/* CPF */}
          <Controller
            control={control}
            name="cpf"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="CPF"
                style={styles.input}
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                maxLength={14} // pode formatar se quiser
              />
            )}
          />
          {errors.cpf && (
            <Text style={styles.errorText}>{errors.cpf.message}</Text>
          )}

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="email@dominio.com"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}

          {/* Senha */}
          <Controller
            control={control}
            name="senha"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Senha"
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.senha && (
            <Text style={styles.errorText}>{errors.senha.message}</Text>
          )}

          {/* Confirmar Senha */}
          <Controller
            control={control}
            name="confirmarSenha"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Confirmar Senha"
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.confirmarSenha && (
            <Text style={styles.errorText}>{errors.confirmarSenha.message}</Text>
          )}

          <TouchableOpacity
            style={styles.btnContinuar}
            onPress={handleSubmit(cadastrarUsuario)}
          >
            <Text style={styles.btnText}>Continuar</Text>
          </TouchableOpacity>

          {/* Aqui você pode deixar os botões sociais ou remover */}

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={[styles.btnSocial]}>
            <Image
              source={{
                uri: "https://www.svgrepo.com/show/475656/google-color.svg",
              }}
              style={styles.socialIcon}
            />
            <Text style={styles.btnTextSocial}>Continuar com o Google</Text>
          </TouchableOpacity>

          
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#ffffff",
  },

  // Caixa branca central
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
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: "#1e3a8a",
    letterSpacing: 0.5,
  },

  descricao: {
    textAlign: "center",
    fontSize: 15,
    color: "#4b5563",
    marginBottom: 24,
    lineHeight: 20,
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

  inputFocus: {
    borderColor: "#3b82f6",
    backgroundColor: "#fff",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 6,
    textAlign: "center",
  },

  btnContinuar: {
    backgroundColor: "#2563eb",
    borderRadius: 25,
    height: 48,
    width: 180,
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

  divider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#d1d5db",
  },

  dividerText: {
    marginHorizontal: 8,
    color: "#6b7280",
    fontSize: 14,
  },

  btnSocial: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    height: 50,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#00b38f",
    shadowColor: "#00b38f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 30,
  },

  btnTextSocial: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },

  socialIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },

  btnVoltar: {
    position: "absolute",
    top: 25,
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
});
