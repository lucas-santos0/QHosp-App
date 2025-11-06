import React, { useEffect } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../../conexaoFirebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router } from "expo-router";

const schema = z.object({
  dataNascimento: z.string().min(1, "Informe a data de nascimento"),
  sexo: z.string().min(1, "Informe o sexo"),
  telefone: z.string().min(6, "Informe um telefone válido"),
  tipoSanguineo: z.string().min(1, "Informe o tipo sanguíneo"),
  alergia: z.string().optional(),
  endereco: z.string().min(1, "Informe o endereço"),
});

type FormData = z.infer<typeof schema>;

export default function FichaMedica() {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function salvarFicha(data: FormData) {
    if (!auth.currentUser) {
      Alert.alert("Erro", "Você precisa estar logado para salvar a ficha médica");
      return;
    }
    const uid = auth.currentUser.uid;
    const ficha = {
      data_nascimento: data.dataNascimento,
      sexo: data.sexo,
      telefone: data.telefone,
      tipo_sanguineo: data.tipoSanguineo,
      alergia: data.alergia,
      endereco: data.endereco,
    };
    try {
      const fichaRef = doc(db, "Usuarios", uid, "FichaMedica", "fichaPrincipal");
      await setDoc(fichaRef, ficha, { merge: true });
      Alert.alert("Sucesso", "Ficha médica salva com sucesso!");
      reset(ficha);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro ao salvar ficha médica.");
    }
  }

  function waitForUser() {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  useEffect(() => {
    async function carregarFicha() {
      const user: any = await waitForUser();
      if (!user) return;
      const fichaRef = doc(db, "Usuarios", user.uid, "FichaMedica", "fichaPrincipal");
      try {
        const fichaDoc = await getDoc(fichaRef);
        if (fichaDoc.exists()) {
          const dados = fichaDoc.data();
          setValue("dataNascimento", dados.data_nascimento || "");
          setValue("sexo", dados.sexo || "");
          setValue("telefone", dados.telefone || "");
          setValue("tipoSanguineo", dados.tipo_sanguineo || "");
          setValue("alergia", dados.alergia || "");
          setValue("endereco", dados.endereco || "");
        }
      } catch (error) {
        console.error(error);
      }
    }
    carregarFicha();
  }, [setValue]);

  async function logout() {
    try {
      await auth.signOut();
      Alert.alert("Sucesso", "Logout realizado com sucesso!");
      router.replace("/");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível deslogar.");
    }
  }

  return (
    <LinearGradient
      colors={["#f0f4f8", "#ffffff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <Text style={styles.titulo}>Ficha Médica</Text>

              <Controller
                control={control}
                name="dataNascimento"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Data de Nascimento"
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.dataNascimento && <Text style={styles.errorText}>{errors.dataNascimento.message}</Text>}

              <Controller
                control={control}
                name="sexo"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Sexo (M/F)"
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.sexo && <Text style={styles.errorText}>{errors.sexo.message}</Text>}

              <Controller
                control={control}
                name="telefone"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Telefone"
                    style={styles.input}
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.telefone && <Text style={styles.errorText}>{errors.telefone.message}</Text>}

              <Controller
                control={control}
                name="tipoSanguineo"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Tipo Sanguíneo"
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.tipoSanguineo && <Text style={styles.errorText}>{errors.tipoSanguineo.message}</Text>}

              <Controller
                control={control}
                name="alergia"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Alergia (se houver)"
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="endereco"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Endereço"
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.endereco && <Text style={styles.errorText}>{errors.endereco.message}</Text>}

              <TouchableOpacity style={styles.btnSalvar} onPress={handleSubmit(salvarFicha)}>
                <Text style={styles.btnText}>Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnLogout} onPress={logout}>
                <Text style={styles.btnText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    backgroundColor: "transparent",
    color: "#1e3a8a",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#a0aec0",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  errorText: {
    color: "#dc2626",
    marginBottom: 12,
    textAlign: "center",
  },
  btnSalvar: {
    backgroundColor: "#1e3a8a",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 16,
  },
  btnLogout: {
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 16,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
