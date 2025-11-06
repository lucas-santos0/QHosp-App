import React, { useState } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../conexaoFirebase/firebase";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const schema = z.object({
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF inválido"),
  nome: z.string().min(3, "Nome inválido"),
  codigo: z.string().length(6, "Código inválido").optional(),
});

type FormData = z.infer<typeof schema>;

export default function EsqueceuSenha() {
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [emailVerificado, setEmailVerificado] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    if (!codigoEnviado) {
      try {
        const usuariosRef = collection(db, "Usuarios");
        const q = query(usuariosRef, where("Email", "==", data.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          Alert.alert("Erro", "Usuário não encontrado com esse e-mail.");
          return;
        }

        let usuarioEncontrado = null;
        querySnapshot.forEach((doc) => {
          const dados = doc.data();
          if (dados.CPF === data.cpf && dados.Nome === data.nome) {
            usuarioEncontrado = { id: doc.id, ...dados };
          }
        });

        if (!usuarioEncontrado) {
          Alert.alert("Erro", "Dados não conferem. Verifique CPF e nome.");
          return;
        }

        const response = await fetch("http://localhost:5000/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        });

        const result = await response.json();

        if (response.ok) {
          Alert.alert("Sucesso", result.message || "Usuário verificado!");
          setCodigoEnviado(true);
          setEmailVerificado(data.email);
        } else {
          Alert.alert("Erro", result.error || "Erro ao enviar o código.");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Erro ao verificar usuário. Tente novamente.");
      }
    } else {
      if (!data.codigo) {
        Alert.alert("Erro", "Digite o código enviado para o seu e-mail.");
        return;
      }

      if (!emailVerificado) {
        Alert.alert("Erro", "E-mail não verificado ainda.");
        return;
      }

      router.push({
        pathname: "/redefinirSenha",
        params: { email: emailVerificado, code: data.codigo.trim() },
      });
    }
  }

  function limparCampos() {
    reset();
    setCodigoEnviado(false);
  }

  function voltar() {
    router.replace("/");
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
          <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.voltar} onPress={voltar}>
              <Text style={styles.voltarTexto}>←</Text>
            </TouchableOpacity>

            <View style={styles.box}>
              <Text style={styles.titulo}>
                {!codigoEnviado
                  ? "Preencha os campos abaixo para Redefinir sua senha!"
                  : "Enviamos um código de verificação para o seu e-mail. Insira-o abaixo para continuar."}
              </Text>

              {!codigoEnviado && (
                <>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="Email"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                  <Text style={styles.erro}>{errors.email?.message}</Text>

                  <Controller
                    control={control}
                    name="cpf"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="CPF"
                        style={styles.input}
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                  <Text style={styles.erro}>{errors.cpf?.message}</Text>

                  <Controller
                    control={control}
                    name="nome"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="Nome completo"
                        style={styles.input}
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                  <Text style={styles.erro}>{errors.nome?.message}</Text>
                </>
              )}

              {codigoEnviado && (
                <>
                  <Controller
                    control={control}
                    name="codigo"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="Código de 6 dígitos"
                        style={styles.input}
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                  <Text style={styles.erro}>{errors.codigo?.message}</Text>
                </>
              )}

              <View style={styles.botoes}>
                <TouchableOpacity style={styles.botao} onPress={limparCampos}>
                  <Text style={styles.botaoTexto}>Limpar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botao}
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text style={styles.botaoTexto}>
                    {!codigoEnviado ? "Verificar usuário" : "Avançar"}
                  </Text>
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
    width: "100%",
    maxWidth: 420,
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: "transparent",
    color: "#1e3a8a",
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
    marginBottom: 6,
  },
  erro: {
    color: "red",
    fontSize: 13,
    marginBottom: 8,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 10,
  },
  botao: {
    backgroundColor: "#0077b6",
    borderRadius: 25,
    width: 140,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#0077b6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  voltar: {
    position: "absolute",
    top: 40,
    left: 20,
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
  voltarTexto: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
