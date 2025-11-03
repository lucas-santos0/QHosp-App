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

      // Navegação usando router do expo-router
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
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={voltar}>
            <Text style={styles.voltar}>{'< Voltar'}</Text>
          </TouchableOpacity>

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
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 18,
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
    marginBottom: 8,
    fontSize: 12,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  botao: {
    flex: 1,
    backgroundColor: "#2c3e50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "600",
  },
  voltar: {
    color: "#2c3e50",
    marginBottom: 12,
    fontWeight: "600",
  },
});
