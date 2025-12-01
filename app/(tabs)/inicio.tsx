<<<<<<< HEAD
import React, { useState } from "react";
=======
import React from "react";
>>>>>>> 6a914d616f8ac10ce735db59cf95146c8dd30c09
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
<<<<<<< HEAD
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Carousel } from "../../components/Carousel"; // teu carrossel
=======
import { LinearGradient } from "expo-linear-gradient";
>>>>>>> 6a914d616f8ac10ce735db59cf95146c8dd30c09

export default function Inicio() {
  const schema = z.object({
    localizacao: z.string().optional(),
    nome: z.string().optional(),
  });

  type FormData = z.infer<typeof schema>;

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { localizacao: "", nome: "" },
  });

  const [hospitaisExibidos, setHospitaisExibidos] = useState<any[]>([]);
  const [erro, setErro] = useState("");

  // 🔹 Simulação dos dados do CNES e IBGE
  const hospitaisFake = [
    {
      NO_FANTASIA: "Hospital Santa Luzia",
      NO_LOGRADOURO: "Rua das Flores",
      NU_ENDERECO: "123",
      NO_BAIRRO: "Centro",
      CO_IBGE: "355030", // São Paulo (sem dígito verificador)
    },
    {
      NO_FANTASIA: "Hospital Vida Nova",
      NO_LOGRADOURO: "Av. Brasil",
      NU_ENDERECO: "456",
      NO_BAIRRO: "Jardim Paulista",
      CO_IBGE: "330455", // Rio de Janeiro
    },
    {
      NO_FANTASIA: "Hospital Esperança",
      NO_LOGRADOURO: "Rua das Palmeiras",
      NU_ENDERECO: "789",
      NO_BAIRRO: "Bela Vista",
      CO_IBGE: "355030",
    },
  ];

  // 🔹 Mini tabela simulando a API do IBGE (com id e nome)
  const municipiosFake = [
    { id: 3550308, nome: "São Paulo" },
    { id: 3304557, nome: "Rio de Janeiro" },
  ];

  function normalizar(str: string) {
    return str
      .normalize("NFD")
      .replace(/\s+/g, "")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  async function verificarEstabelecimento(data: FormData) {
    try {
      const nome = data.nome?.trim() || "";
      const local = data.localizacao?.trim() || "";

      let resultados = hospitaisFake;

      // 🔸 1. Filtra por nome se o usuário preencher
      if (nome) {
        resultados = resultados.filter((h) =>
          normalizar(h.NO_FANTASIA).includes(normalizar(nome))
        );
      }

      // 🔸 2. Se o usuário preencher cidade
      if (local) {
        // Simula a busca do município no IBGE
        const municipio = municipiosFake.find(
          (m) => normalizar(m.nome) === normalizar(local)
        );

        if (!municipio) {
          setErro("Município não encontrado");
          setHospitaisExibidos([]);
          return;
        }

        // 🔸 3. Simula a conversão do código IBGE (8 dígitos) para o código CNES (6 dígitos)
        // O cálculo remove os dois últimos dígitos (dígito verificador)
        const codigoCNES = String(Math.floor(municipio.id / 10));

        resultados = resultados.filter((h) => h.CO_IBGE === codigoCNES);
      }

      if (resultados.length === 0) {
        setErro("Nenhum hospital encontrado");
      } else {
        setErro("");
      }

      const dadosCarrossel = resultados.map((h) => ({
        imagem: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f",
        nome: h.NO_FANTASIA,
        endereco: `${h.NO_LOGRADOURO}, ${h.NU_ENDERECO} - ${h.NO_BAIRRO}`,
        lotacao: Math.floor(Math.random() * 100),
      }));

      setHospitaisExibidos(dadosCarrossel);
    } catch (err) {
      console.log("Erro inesperado", err);
      setErro("Erro inesperado");
    }
  }

  return (
    <LinearGradient
      colors={["#0077b6", "#00b38f"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
<<<<<<< HEAD
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.titulo}>Pesquise pelo hospital</Text>

          <Text style={styles.subtitulo}>Localização:</Text>
          <Controller
            control={control}
            name="localizacao"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Digite a cidade"
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Text style={styles.subtitulo}>Nome do Hospital:</Text>
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Digite o nome"
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <TouchableOpacity
            style={styles.botao}
            onPress={handleSubmit(verificarEstabelecimento)}
          >
            <Text style={styles.textoBotao}>Buscar</Text>
          </TouchableOpacity>

          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          {hospitaisExibidos.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Carousel dados={hospitaisExibidos} />
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
=======
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
>>>>>>> 6a914d616f8ac10ce735db59cf95146c8dd30c09
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
<<<<<<< HEAD
    padding: 24,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  botao: {
    backgroundColor: "#2c3e50",
    padding: 14,
    borderRadius: 8,
=======
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
>>>>>>> 6a914d616f8ac10ce735db59cf95146c8dd30c09
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#1e40af",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
<<<<<<< HEAD
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  erro: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
=======
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
>>>>>>> 6a914d616f8ac10ce735db59cf95146c8dd30c09
  },
});
