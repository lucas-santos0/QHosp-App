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
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Carousel } from "../../components/Carousel"; // teu carrossel

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    alignItems: "center",
    marginVertical: 16,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  erro: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
